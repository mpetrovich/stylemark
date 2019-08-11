const inlineImports = require('./inlineImports')

module.exports = ({ dirpath }) => (tree, file) =>
	Promise.all(
		file.data.specimenBlocks.map(block => {
			return inlineImports(block.displayContent, { dirpath })
				.then(executableContent => {
					block.executableContent = executableContent
				})
				.catch(error => {
					block.executableContent = JSON.stringify(error)
				})
		})
	)
		.catch(error => console.error(error))
		.then(() => {})
