/* istanbul ignore file */

const fs = require("fs")
const path = require("path")
const mkdirp = require("mkdirp")
const _ = require("lodash")
const Library = require("./models/Library")
const getMatchingFiles = require("./utils/getMatchingFiles")
const extractCommentBlocks = require("./parse/extractCommentBlocks")
const parseComponent = require("./parse/parseComponent")
const compileLibrary = require("./compile/compileLibrary")

module.exports = ({ input, output, name, cwd }) => {
    const inputFilepaths = getMatchingFiles(input, cwd)
    const components = _.flatMap(inputFilepaths, filepath => {
        const content = fs.readFileSync(filepath, { encoding: "utf8" })
        const isMarkdownFile = filepath.endsWith(".md") || filepath.endsWith(".markdown")
        return isMarkdownFile ? parseComponent(content) : extractCommentBlocks(content).map(parseComponent)
    })
    const library = new Library({ name, components })
    const html = compileLibrary(library)

    const outputFilepath = path.join(output, "index.html")
    mkdirp(output)
    fs.writeFileSync(outputFilepath, html)
}
