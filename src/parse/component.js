const unified = require("unified")
const vfile = require("vfile")
const parseMarkdown = require("remark-parse")
const extractFrontmatter = require("remark-extract-frontmatter")
const parseFrontmatter = require("remark-frontmatter")
const yamlParser = require("yaml").parse
const _ = require("lodash")
const parseSpecimens = require("./specimens")
const Component = require("../model/component")

module.exports = markdown => {
    const file = vfile(markdown)

    const markdownTree = unified()
        .use(parseMarkdown)
        .use(parseFrontmatter)
        .use(extractFrontmatter, { name: "frontmatter", yaml: yamlParser })
        .parse(file)

    unified()
        .use(parseSpecimens)
        .runSync(markdownTree, file)

    const metadata = _.get(file, "data.frontmatter", {})
    const specimens = file.data.specimens
    const component = metadata.name ? new Component({ metadata, specimens, markdown, markdownTree }) : null
    return component
}