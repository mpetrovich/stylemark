const unified = require('unified')
const parseMarkdown = require('remark-parse')
const toHtmlTree = require('remark-rehype')
const parseFrontmatter = require('remark-frontmatter')
const extractFrontmatter = require('remark-extract-frontmatter')
const yamlParser = require('yaml').parse
const extractSpecimenBlocks = require('./extractSpecimenBlocks')
const removeHiddenCodeBlocks = require('./removeHiddenCodeBlocks')
const toHtmlString = require('rehype-stringify')
const _ = require('lodash')

module.exports = (markdown, { importLoader }) => {
	const result = unified()
		.use(parseMarkdown)
		.use(parseFrontmatter)
		.use(extractFrontmatter, { name: 'frontmatter', yaml: yamlParser })
		.use(extractSpecimenBlocks, { importLoader })
		.use(removeHiddenCodeBlocks)
		.use(toHtmlTree)
		.use(toHtmlString)
		.processSync(markdown)

	if (!result.data.frontmatter || !result.data.frontmatter.name) {
		return null
	}

	const specimens = _(result.data.specimenBlocks)
		.groupBy('specimenName')
		.map((blocks, specimenName) => ({
			name: specimenName,
			blocks: blocks.map(block => ({
				language: block.language,
				flags: block.flags,
				props: block.props,
				content: block.content,
			})),
		}))
		.value()

	return {
		contentHtml: result.contents,
		meta: result.data.frontmatter,
		specimens,
	}
}
