const unified = require('unified')
const markdownParser = require('remark-parse')
const markdownExtractor = require('remark-rehype')
const frontmatterParser = require('remark-frontmatter')
const frontmatterExtractor = require('remark-extract-frontmatter')
const yamlParser = require('yaml').parse
const specimenBlockExtractor = require('../specimenBlockExtractor')
const htmlRenderer = require('rehype-stringify')
const _ = require('lodash')

module.exports = markdown => {
	const result = unified()
		.use(markdownParser)
		.use(frontmatterParser)
		.use(frontmatterExtractor, { name: 'frontmatter', yaml: yamlParser })
		.use(specimenBlockExtractor)
		.use(markdownExtractor)
		.use(htmlRenderer)
		.processSync(markdown)

	if (!result.data.frontmatter || !result.data.frontmatter.name) {
		return null
	}

	const specimens = _(result.data.specimenBlocks)
		.groupBy('specimenName')
		.map((blocks, specimenName) => ({
			name: specimenName,
			blocks: blocks.map(block => ({
				lang: block.lang,
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