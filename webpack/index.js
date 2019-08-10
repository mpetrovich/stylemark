const fs = require('fs')
const path = require('path')
const webpack = require('webpack')
const MemoryFs = require('memory-fs')
const memfs = new MemoryFs()

memfs.mkdirpSync('/src')
memfs.writeFileSync(
	'/src/entry.js',
	`import exported from './support/exported.js'
import './support/sideeffect.js'
console.log('memfs entry')
exported()
`
)

memfs.mkdirpSync('/dist')
memfs.writeFileSync(
	'/dist/index.html',
	`<!DOCTYPE html>
<html>
	<head>
		<script src="main.js"></script>
	</head>
	<body></body>
</html>`
)

class ResolverPlugin {
	constructor({ dirpath, fileSystem, virtualFileSystem }) {
		this.dirpath = dirpath
		this.fileSystem = fileSystem
		this.virtualFileSystem = virtualFileSystem
	}

	apply(resolver) {
		resolver.hooks.resolve.tapAsync('ResolverPlugin', (request, resolveContext, callback) => {
			const isRelativeFilepath = request.request.startsWith('.')
			const absoluteFilepath = isRelativeFilepath ? path.resolve(this.dirpath, request.request) : request.request

			if (isRelativeFilepath && !this.virtualFileSystem.existsSync(absoluteFilepath)) {
				const requestFileContent = this.fileSystem.readFileSync(absoluteFilepath, { encoding: 'utf8' })
				memfs.mkdirpSync(path.dirname(absoluteFilepath))
				memfs.writeFileSync(absoluteFilepath, requestFileContent)
			}

			const target = resolver.ensureHook('parsedResolve')
			request = Object.assign({}, request, { request: absoluteFilepath })
			resolver.doResolve(target, request, null, resolveContext, callback)
		})
	}
}

const compiler = webpack({
	mode: 'production',
	entry: '/src/entry.js',
	output: {
		path: '/dist',
		filename: 'main.js',
	},
	resolve: {
		plugins: [
			new ResolverPlugin({
				dirpath: path.resolve(__dirname, 'src'),
				fileSystem: fs,
				virtualFileSystem: memfs,
			}),
		],
	},
})

compiler.inputFileSystem = memfs
compiler.resolvers.normal.fileSystem = memfs
compiler.resolvers.context.fileSystem = memfs
compiler.outputFileSystem = memfs

compiler.run((error, stats) => {
	if (error) {
		console.error(error.stack || error)
		if (error.details) {
			console.error(error.details)
		}
		return
	}

	const info = stats.toJson()

	if (stats.hasErrors()) {
		console.error(info.errors)
	}

	if (stats.hasWarnings()) {
		console.warn(info.warnings)
	}

	fs.mkdirSync(path.resolve(__dirname, 'dist'))
	fs.writeFileSync(path.resolve(__dirname, 'dist/index.html'), memfs.readFileSync('/dist/index.html'))
	fs.writeFileSync(path.resolve(__dirname, 'dist/main.js'), memfs.readFileSync('/dist/main.js'))
})
