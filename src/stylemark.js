const fs = require("fs")
const path = require("path")
const globby = require("globby")
const mkdirp = require("mkdirp")
const _ = require("lodash")
const Library = require("./models/Library")
const getMatchingFiles = require("./parse/getMatchingFiles")
const extractCommentBlocks = require("./parse/extractCommentBlocks")
const parseComponent = require("./parse/parseComponent")
const renderLibrary = require("./render/renderLibrary")

module.exports = config => {
    const filepaths = getMatchingFiles(config.input, config.cwd)
    const components = _.flatMap(filepaths, filepath => {
        const content = fs.readFileSync(filepath, { encoding: "utf8" })
        const isMarkdownFile = filepath.endsWith(".md") || filepath.endsWith(".markdown")
        return isMarkdownFile ? parseComponent(content) : extractCommentBlocks(content).map(parseComponent)
    })
    const name = config.name
    const library = new Library({ name, components })

    const html = renderLibrary(library)
    mkdirp(config.output)
    fs.writeFileSync(path.join(config.output, "index.html"), html)
}
