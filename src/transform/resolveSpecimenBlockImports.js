const _ = require('lodash')
const resolveImports = require('./resolveImports')

module.exports = ({ dirpath = null, webpackMode = null } = {}) => (tree, file) => {
	const specimenBlocks = _.flatMap(file.data.specimens, specimen => specimen.blocks)
	
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
		.then(blocks => {
			file.data.specimens = _(specimenBlocks)
				.groupBy('specimenName')
				.map((blocks, specimenName) => ({
					name: specimenName,
					blocks,
				}))
				.value()
		})
}
