const resolveImports = require('./resolveImports')

module.exports = ({ dirpath = null, webpackMode = null } = {}) => (tree, file) => {
	const promises = file.data.specimenBlocks.map((block, index) => {
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
			file.data.specimenBlocks = blocks
		})
}
