const visit = require('unist-util-visit')
const frontmatterFromString = require('gray-matter')
const fs = require('fs')
const path = require('path')
const removeImports = require('./removeImports')
const extractImportFilepaths = require('./extractImportFilepaths')

const loadImports = (importFilepaths, importLoader) =>
	importFilepaths.map(filepath => ({
		filepath,
		content: importLoader(filepath),
	}))

module.exports = ({ importLoader }) => (tree, file) => {
	const specimenBlocks = []

	visit(tree, 'code', node => {
		const [, specimenName, lang] = /(.+)\.([^.]+)$/.exec(node.lang || '') || [] // Matches `(specimenName).(lang)`

		if (!specimenName) {
			return
		}

		const parsed = frontmatterFromString(node.value)
		const props = parsed.data

		if (/\bhidden\b/.test(node.meta)) {
			props.hidden = true
		}

		const contentWithoutFrontmatterOrImports = removeImports(parsed.content)
		node.value = contentWithoutFrontmatterOrImports

		const importFilepaths = extractImportFilepaths(parsed.content)
		const importContents = loadImports(importFilepaths, importLoader)

		specimenBlocks.push({ specimenName, lang, props, content: contentWithoutFrontmatterOrImports })
	})

	file.data.specimenBlocks = specimenBlocks
}
