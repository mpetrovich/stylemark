const _ = require('lodash')
const resolveImports = require('./resolveImports')

module.exports = (component, { dirpath = null, webpackMode = null } = {}) => {
	const specimenBlocks = _.flatMap(component.specimens, specimen => specimen.blocks)

	const promises = specimenBlocks.map((block, index) => {
		return resolveImports(block.displayContent, block.language, { dirpath, webpackMode })
			.then(executableContent => {
				block.executableContent = executableContent
				return block
			})
			.catch(error => {
				block.executableContent = JSON.stringify(error)
				return block
			})
	})

	return Promise.all(promises)
		.catch(error => console.error({ error }))
		.then(() => component)
}
