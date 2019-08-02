const visit = require('unist-util-visit')
const frontmatterFromString = require('gray-matter')
const replaceImportsWithContent = require('./replaceImportsWithContent')
const fs = require('fs')
const path = require('path')

module.exports = ({ importFn }) => (tree, file) => {
	const specimenBlocks = []

	visit(tree, 'code', node => {
		const [, specimenName, lang] = /(.+)\.([^.]+)$/.exec(node.lang || '') || [] // Matches `(specimenName).(lang)`

		if (!specimenName) {
			return
		}

		const parsed = frontmatterFromString(node.value)
		const props = parsed.data
		const content = replaceImportsWithContent(parsed.content, importFn)

		node.value = content // without frontmatter

		if (/\bhidden\b/.test(node.meta)) {
			props.hidden = true
		}

		specimenBlocks.push({ specimenName, lang, props, content })
	})

	file.data.specimenBlocks = specimenBlocks
}
