const fs = require('fs')
const path = require('path')
const webpack = require('webpack')
const MemoryFs = require('memory-fs')
const memfs = new MemoryFs()

memfs.mkdirpSync('/src')
memfs.writeFileSync(
	'/src/entry.js',
	`import exported from './exported'
import './sideeffect'
console.log('memfs entry')
exported()
`
)
memfs.writeFileSync('/src/exported.js', `export default () => console.log('memfs exported')`)
memfs.writeFileSync('/src/sideeffect.js', `console.log('memfs side effect')`)
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

const compiler = webpack({
	mode: 'development',
	entry: '/src/entry.js',
	output: {
		path: '/dist',
		filename: 'main.js',
	},
})

compiler.inputFileSystem = memfs
compiler.resolvers.normal.fileSystem = compiler.inputFileSystem
compiler.resolvers.context.fileSystem = compiler.inputFileSystem
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

	fs.writeFileSync(path.resolve(__dirname, 'index.html'), memfs.readFileSync('/dist/index.html'))
	fs.writeFileSync(path.resolve(__dirname, 'main.js'), memfs.readFileSync('/dist/main.js'))
})
