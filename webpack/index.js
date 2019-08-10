const fs = require('fs')
const path = require('path')
const webpack = require('webpack')
const MemoryFs = require('memory-fs')
const memfs = new MemoryFs()
const { CachedInputFileSystem, ResolverFactory } = require('enhanced-resolve')

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
			const isRelativeImport = request.request.startsWith('.')
			console.log(`Resolving '${request.request}'`)

			if (!isRelativeImport) {
				const target = resolver.ensureHook('parsedResolve')
				resolver.doResolve(target, request, null, resolveContext, callback)
				return
			}

			const requestFilepath = path.resolve(this.dirpath, request.request)

			if (!this.virtualFileSystem.existsSync(requestFilepath)) {
				console.log(`Loading ${requestFilepath} into virtual file system`)
				const requestFileContent = this.fileSystem.readFileSync(requestFilepath, { encoding: 'utf8' })
				memfs.mkdirpSync(path.dirname(requestFilepath))
				memfs.writeFileSync(requestFilepath, requestFileContent)
			} else {
				console.log(`Already loaded ${requestFilepath}`)
			}

			const target = resolver.ensureHook('parsedResolve')
			request = Object.assign({}, request, { request: requestFilepath })
			resolver.doResolve(target, request, null, resolveContext, callback)
		})
	}
}

const compiler = webpack({
	mode: 'development',
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
