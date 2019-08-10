const visit = require('unist-util-visit')
const extractFrontmatter = require('gray-matter')
const fs = require('fs')
const path = require('path')
const inlineImports = require('./inlineImports')

const extractNameAndLanguage = string => {
	const matches = /(.+)\.([^.]+)$/.exec(string || '') // Matches `(specimenName).(language)`
	return matches ? matches.slice(1) : []
}

module.exports = ({ dirpath }) => (tree, file) => {
	var specimenBlocks = []

	visit(tree, 'code', node => {
		const [specimenName, language] = extractNameAndLanguage(node.lang)

		if (!specimenName) {
			return
		}

		const parsed = extractFrontmatter(node.value)

		const displayContent = parsed.content
		const executeContent = dirpath ? inlineImports(displayContent, { dirpath }) : displayContent
		node.value = displayContent

		const props = parsed.data
		const flags = {}

		if (/\bhidden\b/.test(node.meta)) {
			flags.hidden = true
		}

		specimenBlocks.push({
			specimenName,
			language,
			flags,
			props,
			executeContent,
			displayContent,
		})
	})

	file.data.specimenBlocks = specimenBlocks
}
