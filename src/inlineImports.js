const fs = require('fs')
const path = require('path')
const webpack = require('webpack')
const MemoryFs = require('memory-fs')
const memfs = new MemoryFs()

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

module.exports = (content, { dirpath }) => {
	return new Promise((resolve, reject) => {
		const entryFilepath = path.join(dirpath, 'entry.js')

		memfs.mkdirpSync(dirpath)
		memfs.writeFileSync(entryFilepath, content)

		const compiler = webpack({
			mode: 'production',
			entry: entryFilepath,
			output: {
				path: '/dist',
				filename: 'main.js',
			},
			resolve: {
				plugins: [
					new ResolverPlugin({
						dirpath,
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
				reject(error)
				return
			}

			const info = stats.toJson()

			if (stats.hasWarnings()) {
				console.warn(info.warnings)
			}

			if (stats.hasErrors()) {
				console.error(info.errors)
				reject(info.errors)
			} else {
				const content = memfs.readFileSync('/dist/main.js', 'utf8')
				resolve(content)
			}
		})
	})
}
