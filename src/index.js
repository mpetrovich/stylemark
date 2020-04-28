/* istanbul ignore file */

const debug = require("debug")("stylemark:processor")
const fs = require("fs")
const fetch = require("node-fetch")
const path = require("path")
const mkdirp = require("mkdirp")
const cpy = require("cpy")
const cpFile = require("cp-file")
const isGlob = require("is-glob")
const _ = require("lodash")
const Config = require("./models/Config")
const Library = require("./models/Library")
const getMatchingFiles = require("./utils/getMatchingFiles")
const extractCommentBlocks = require("./parse/extractCommentBlocks")
const parseComponent = require("./parse/parseComponent")
const compileLibrary = require("./compile/compileLibrary")

const requiredHeadAssets = [path.resolve(__dirname, "assets/initializeSpecimenEmbed.js")]

const stylemark = ({ input, output, cwd, name, head = [], body = [], assets = [] }) => {
    const config = new Config({
        input,
        output: path.resolve(cwd, output),
        cwd,
        name,
        head: head.concat(requiredHeadAssets),
        body,
        assets,
    })
    const library = parseLibrary(config)
    outputLibrary(library, config)
    copyThemeFiles(config)
}

const parseLibrary = config => {
    const files = getMatchingFiles(config.input, config.cwd)
    const components = parseComponents(files)
    const library = new Library({ name: config.name, components })
    return library
}

const parseComponents = files => {
    const components = _.flatMap(files, file => {
        const content = fs.readFileSync(file, { encoding: "utf8" })
        const isMarkdownFile = file.endsWith(".md") || file.endsWith(".markdown")
        return isMarkdownFile ? parseComponent(content) : extractCommentBlocks(content).map(parseComponent)
    })
    return components
}

const outputLibrary = (library, config) => {
    const html = compileLibrary(library, config)
    mkdirp.sync(config.output)
    fs.writeFileSync(path.resolve(config.output, "index.html"), html)
}

const copyThemeFiles = config => {
    downloadRemoteAssetFiles(config)
    copyLocalAssetFiles(config)
    copyLocalHeadAndBodyFiles(config)
}

const downloadRemoteAssetFiles = config => {
    const urlAssets = _.pickBy(config.assets, (to, from) => isUrl(from))
    _.forEach(urlAssets, (local, url) => downloadFile(url, path.resolve(config.output, local)))
}

const copyLocalAssetFiles = config => {
    const localAssets = _.pickBy(config.assets, (to, from) => isLocalFile(from))
    _.forEach(localAssets, async (to, from) => {
        const useSourcePath = to === true
        const src = path.resolve(config.cwd, from)
        const dest = path.resolve(config.output, useSourcePath ? from : to)
        try {
            if (isGlob(from)) {
                debug(`Copying files from "${config.cwd}/${from}" to "${dest}"`)
                await cpy(from, dest, { cwd: config.cwd })
            } else {
                debug(`Copying file from "${src}" to "${dest}"`)
                await cpFile(src, dest)
            }
        } catch (error) {
            debug(`Error copying file(s) "${config.cwd}/${from}" to "${dest}":`, error)
        }
    })
}

const copyLocalHeadAndBodyFiles = config => {
    const localHeadBodyFiles = [].concat(config.head, config.body).filter(isLocalFile)
    localHeadBodyFiles.forEach(file => {
        const src = path.resolve(config.cwd, file)
        const dest = path.resolve(config.output, path.basename(file))
        try {
            fs.copyFileSync(src, dest)
        } catch (error) {
            debug(`Error copying file "${src}" to "${dest}":`, error)
        }
    })
}

const isLocalFile = str => str && /^(<|https?:|:\/\/)/.test(str) === false
const isUrl = str => /^https?:\/\//.test(str)

const downloadFile = async (url, to) => {
    try {
        const response = await fetch(url)
        const stream = fs.createWriteStream(to)
        response.body.pipe(stream)
    } catch (error) {
        debug(`Error downloading URL "${url}" to file "${to}":`, error)
    }
}

module.exports = stylemark
