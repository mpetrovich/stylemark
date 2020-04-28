/* istanbul ignore file */

const debug = require("debug")("stylemark:processor")
const fs = require("fs")
const fetch = require("node-fetch")
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

const downloadFile = (url, to) => {
    fetch(url).then(response => {
        const stream = fs.createWriteStream(to)
        response.body.pipe(stream)
    })
}

const isLocalFile = str => str && /^(<|https?:|:\/\/)/.test(str) === false
const isUrl = str => /^https?:\/\//.test(str)

module.exports = ({ input, output, name, cwd, theme = {} }) => {
    const outputPath = path.resolve(cwd, output)

    const inputFiles = getMatchingFiles(input, cwd)
    const components = parseComponents(inputFiles)
    const library = new Library({ name, components })

    theme.head = (theme.head || []).concat(requiredHeadAssets)
    theme.body = theme.body || []
    theme.assets = theme.assets || []

    const html = compileLibrary(library, theme)
    mkdirp.sync(outputPath)
    fs.writeFileSync(path.resolve(outputPath, "index.html"), html)

    const localHeadBodyFiles = [].concat(theme.head, theme.body).filter(isLocalFile)
    localHeadBodyFiles.forEach(file => {
        const src = path.resolve(cwd, file)
        const dest = path.resolve(outputPath, path.basename(file))
        try {
            fs.copyFileSync(src, dest)
        } catch (error) {
            debug(`Error copying file "${src}":`, error)
        }
    })

    const urlAssets = _.pickBy(theme.assets, (to, from) => isUrl(from))
    _.forEach(urlAssets, (local, url) => downloadFile(url, path.resolve(outputPath, local)))

    const localAssets = _.pickBy(theme.assets, (to, from) => isLocalFile(from))
    _.forEach(localAssets, (to, from) => {
        const src = path.resolve(cwd, from)
        const dest = path.resolve(outputPath, to === true ? from : to)
        fs.copyFileSync(src, dest)
    })
}
