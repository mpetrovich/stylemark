const fs = require('fs')
const path = require('path')
const webpack = require('webpack')
const MemoryFs = require('memory-fs')

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
				var requestFileContent
				try {
					requestFileContent = this.fileSystem.readFileSync(absoluteFilepath, { encoding: 'utf8' })
				} catch (error) {
					requestFileContent = this.fileSystem.readFileSync(`${absoluteFilepath}.js`, { encoding: 'utf8' })
				}
				this.virtualFileSystem.mkdirpSync(path.dirname(absoluteFilepath))
				this.virtualFileSystem.writeFileSync(absoluteFilepath, requestFileContent)
			}

			const target = resolver.ensureHook('parsedResolve')
			request = Object.assign({}, request, { request: absoluteFilepath })
			resolver.doResolve(target, request, null, resolveContext, callback)
		})
	}
}

module.exports = (content, extension, { dirpath = null, webpackMode = null } = {}) => {
	return new Promise((resolve, reject) => {
		if (!dirpath) {
			return resolve(content)
		}
		if (extension !== 'js') {
			return resolve(content)
		}

		const entryFilepath = path.join(dirpath, `entry.${extension}`)

		const memfs = new MemoryFs()
		memfs.mkdirpSync(dirpath)
		memfs.writeFileSync(entryFilepath, content)
		memfs.writeFileSync('/package.json', '{}')

		const compiler = webpack({
			mode: webpackMode || 'production',
			entry: entryFilepath,
			output: {
				path: '/dist',
				filename: `dist.${extension}`,
			},
			resolve: {
				descriptionFiles: ['package.json'],
				plugins: [
					new ResolverPlugin({
						dirpath,
						fileSystem: fs,
						virtualFileSystem: memfs,
					}),
				],
			},
			externals: {
				document: 'document',
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
				return reject(error)
			}

			const info = stats.toJson()

			if (stats.hasWarnings()) {
				console.warn(info.warnings)
			}

			if (stats.hasErrors()) {
				console.error(info.errors)
				reject(info.errors)
			} else {
				const content = memfs.readFileSync(`/dist/dist.${extension}`, 'utf8')
				resolve(content)
			}
		})
	})
}
