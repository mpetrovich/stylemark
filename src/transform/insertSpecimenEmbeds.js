const visit = require('unist-util-visit')
const u = require('unist-builder')

const isRenderableLanguage = { html: true }

const extractNameAndLanguage = string => {
	const matches = /(.+)\.([^.]+)$/.exec(string || '') // Matches `(specimenName).(language)`
	return matches ? matches.slice(1) : []
}

module.exports = () => (tree, file) => {
	// NOTE: This relies on the side effects of the frontmatter extractor
	const componentName = file.data.frontmatter ? file.data.frontmatter.name : null
	const isSpecimenAlreadyRendered = {}

	visit(tree, 'code', (node, index, parent) => {
		const [specimenName, language] = extractNameAndLanguage(node.lang)

		if (specimenName && isRenderableLanguage[language] && !isSpecimenAlreadyRendered[specimenName]) {
			isSpecimenAlreadyRendered[specimenName] = true
			const renderNode = u('specimen-embed', { componentName, specimenName, language }, '')
			parent.children.splice(index, 0, renderNode)
			return index + 2
		}
	})
}
