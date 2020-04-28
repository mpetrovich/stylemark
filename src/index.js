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

const requiredHeadAssets = [path.resolve(__dirname, "assets/initializeSpecimenEmbed.js")]

const parseComponents = files => {
    const components = _.flatMap(files, file => {
        const content = fs.readFileSync(file, { encoding: "utf8" })
        const isMarkdownFile = file.endsWith(".md") || file.endsWith(".markdown")
        return isMarkdownFile ? parseComponent(content) : extractCommentBlocks(content).map(parseComponent)
    })
    return components
}

const copyFiles = (files, from, to) => {
    files.forEach(file => {
        const src = path.resolve(from, file)
        const dest = path.resolve(to, path.basename(file))
        fs.copyFileSync(src, dest)
    })
}

const isLocalFile = str => /^(<|https?:|:\/\/)/.test(str) === false

module.exports = ({ input, output, name, cwd, theme = {} }) => {
    const inputFiles = getMatchingFiles(input, cwd)
    const components = parseComponents(inputFiles)
    const library = new Library({ name, components })

    theme.head = (theme.head || []).concat(requiredHeadAssets)
    theme.body = theme.body || []

    const html = compileLibrary(library, theme)
    mkdirp.sync(output)
    fs.writeFileSync(path.resolve(output, "index.html"), html)

    const localFiles = [].concat(theme.head, theme.body).filter(isLocalFile)
    copyFiles(localFiles, cwd, path.resolve(cwd, output))
}
