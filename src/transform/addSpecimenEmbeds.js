const visit = require('unist-util-visit')
const u = require('unist-builder')
const _ = require('lodash')

const isRenderableLanguage = { html: true }

const extractNameAndLanguage = string => {
	const matches = /(.+)\.([^.]+)$/.exec(string || '') // Matches `(specimenName).(language)`
	return matches ? matches.slice(1) : []
}

module.exports = ({ component }) => (tree, file) => {
	const isSpecimenAlreadyRendered = {}

	visit(tree, 'code', (node, index, parent) => {
		const [specimenName, language] = extractNameAndLanguage(node.lang)

		if (specimenName && isRenderableLanguage[language] && !isSpecimenAlreadyRendered[specimenName]) {
			isSpecimenAlreadyRendered[specimenName] = true

			const specimen = _.find(component.specimens, { name: specimenName })
			const node = u('specimen-embed', { component, specimen }, '')
			parent.children.splice(index, 0, node)

			return index + 2
		}
	})
}
