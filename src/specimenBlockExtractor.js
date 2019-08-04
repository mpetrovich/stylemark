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

const extractBlockNameAndExtension = string => {
	// Matches `(specimenName).(extension)`
	const matches = /(.+)\.([^.]+)$/.exec(string || '') || []
	return matches.slice(1)
}

module.exports = ({ importLoader }) => (tree, file) => {
	var specimenBlocks = []

	visit(tree, 'code', node => {
		const [specimenName, extension] = extractBlockNameAndExtension(node.lang)

		if (!specimenName) {
			return
		}

		const parsed = extractFrontmatter(node.value)
		const props = parsed.data
		const flags = {}

		if (/\bhidden\b/.test(node.meta)) {
			flags.hidden = true
		}

		const contentWithoutFrontmatterOrImports = removeImports(parsed.content)
		node.value = contentWithoutFrontmatterOrImports

		const importFilepaths = extractImportFilepaths(parsed.content)
		const importContents = loadImports(importFilepaths, importLoader)
		const importBlocks = importContents.map(imported => {
			const [, extension] = extractBlockNameAndExtension(imported.filepath)
			const block = {
				specimenName,
				lang: extension,
				flags: {},
				props: {},
				content: imported.content,
			}
			if (extension !== 'html') {
				block.flags.hidden = true
			}
			return block
		})
		specimenBlocks = specimenBlocks.concat(importBlocks)

		specimenBlocks.push({ specimenName, lang: extension, flags, props, content: contentWithoutFrontmatterOrImports })
	})

	file.data.specimenBlocks = specimenBlocks
}
