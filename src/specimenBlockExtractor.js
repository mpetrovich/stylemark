const visit = require('unist-util-visit')
const frontmatterFromString = require('gray-matter')

module.exports = () => (tree, file) => {
	const specimenBlocks = []

	visit(tree, 'code', node => {
		const [, specimenName, lang] = /(.+)\.([^.]+)$/.exec(node.lang || '') || [] // Matches `(specimenName).(lang)`

		if (!specimenName) {
			return
		}

		const parsed = frontmatterFromString(node.value)
		const props = parsed.data
		const content = parsed.content

		node.value = content // without frontmatter

		if (/\bhidden\b/.test(node.meta)) {
			props.hidden = true
		}

		specimenBlocks.push({ specimenName, lang, props, content })
	})

	file.data.specimenBlocks = specimenBlocks
}
