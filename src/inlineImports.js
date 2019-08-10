const fs = require('fs')
const path = require('path')
const webpack = require('webpack')
const MemoryFs = require('memory-fs')

module.exports = (content, { dirpath }) => {
	const memfs = new MemoryFs()
	memfs.mkdirpSync(dirpath)
	memfs.writeFileSync(path.join(dirpath, 'entry.js'), content)

	const compiler = webpack({
		mode: 'development', // @todo Make context-aware
		entry: path.join(dirpath, 'entry.js'),
		output: {
			path: dirpath,
			filename: 'dist.js',
		},
	})

	compiler.inputFileSystem = memfs
	compiler.resolvers.normal.fileSystem = fs
	compiler.resolvers.context.fileSystem = fs
	compiler.outputFileSystem = memfs
}

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
