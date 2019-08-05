const unified = require('unified')
const parseMarkdown = require('remark-parse')
const extractFrontmatter = require('remark-extract-frontmatter')
const parseFrontmatter = require('remark-frontmatter')
const yamlParser = require('yaml').parse
const toHtmlTree = require('remark-rehype')
const toHtmlString = require('rehype-stringify')
const _ = require('lodash')
const extractSpecimenBlocks = require('./extractSpecimenBlocks')
const insertSpecimenEmbeds = require('./insertSpecimenEmbeds')
const removeHiddenCodeBlocks = require('./removeHiddenCodeBlocks')

module.exports = (markdown, { importLoader = null, iframePathFn = null } = {}) => {
	const result = unified()
		.use(parseMarkdown)
		.use(parseFrontmatter)
		.use(extractFrontmatter, { name: 'frontmatter', yaml: yamlParser })
		.use(extractSpecimenBlocks, { importLoader })
		.use(insertSpecimenEmbeds)
		.use(removeHiddenCodeBlocks)
		.use(toHtmlTree, {
			handlers: {
				'specimen-embed': (h, node) =>
					iframePathFn
						? h(node, 'iframe', {
								src: iframePathFn({
									componentName: node.componentName,
									specimenName: node.specimenName,
									language: node.language,
								}),
						  })
						: null,
			},
		})
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
		name: result.data.frontmatter.name,
		meta: _.omit(result.data.frontmatter, 'name'),
		specimens,
		contentHtml: result.contents,
	}
}
