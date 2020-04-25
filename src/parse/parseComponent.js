const unified = require("unified")
const vfile = require("vfile")
const parseMarkdown = require("remark-parse")
const extractFrontmatter = require("remark-extract-frontmatter")
const parseFrontmatter = require("remark-frontmatter")
const yamlParser = require("yaml").parse
const _ = require("lodash")
const parseSpecimens = require("./parseSpecimens")
const Component = require("../models/Component")

module.exports = markdown => {
    const file = vfile(markdown)

    const markdownTree = unified()
        .use(parseMarkdown)
        .use(parseFrontmatter)
        .use(extractFrontmatter, { name: "frontmatter", yaml: yamlParser })
        .parse(file)
    const metadata = _.get(file, "data.frontmatter", {})

    unified()
        .use(parseSpecimens)
        .runSync(markdownTree, file)
    const specimens = file.data.specimens

    if (!metadata.name) {
        return null
    }

    const component = new Component({ metadata, specimens, markdown, markdownTree })
    return component
}
