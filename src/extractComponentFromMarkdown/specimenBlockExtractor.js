const visit = require('unist-util-visit')
const extractFrontmatter = require('gray-matter')
const fs = require('fs')
const path = require('path')
const removeImports = require('./removeImports')
const extractImportFilepaths = require('./extractImportFilepaths')

const loadImports = (importFilepaths, importLoader) =>
	importFilepaths.map(filepath => ({
		filepath,
		content: importLoader(filepath),
	}))

const extractNameAndExtension = string => {
	// Matches `(specimenName).(extension)`
	const matches = /(.+)\.([^.]+)$/.exec(string || '') || []
	return matches.slice(1)
}

const hasHiddenFlag = string => /\bhidden\b/.test(string)

module.exports = ({ importLoader }) => (tree, file) => {
	const specimenBlocks = []

	visit(tree, 'code', node => {
		const [specimenName, extension] = extractNameAndExtension(node.lang)

		if (!specimenName) {
			return
		}

		const parsed = extractFrontmatter(node.value)
		const props = parsed.data

		if (hasHiddenFlag(node.meta)) {
			props.hidden = true
		}

		const contentWithoutFrontmatterOrImports = removeImports(parsed.content)
		node.value = contentWithoutFrontmatterOrImports

		const importFilepaths = extractImportFilepaths(parsed.content)
		const importContents = loadImports(importFilepaths, importLoader)

		specimenBlocks.push({ specimenName, lang: extension, props, content: contentWithoutFrontmatterOrImports })
	})

	file.data.specimenBlocks = specimenBlocks
}
