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
const Library = require("./models/Library")
const getMatchingFiles = require("./utils/getMatchingFiles")
const extractCommentBlocks = require("./parse/extractCommentBlocks")
const parseComponent = require("./parse/parseComponent")
const compileLibrary = require("./compile/compileLibrary")

const requiredHeadAssets = [path.resolve(__dirname, "assets/initializeSpecimenEmbed.js")]

const stylemark = ({ input, output, name, cwd, head = [], body = [], assets = [] }) => {
    const library = parseLibrary({ input, cwd, name })
    output = path.resolve(cwd, output)
    head = head.concat(requiredHeadAssets)
    outputLibrary({ library, head, body, output })
    copyThemeFiles({ head, body, assets, cwd, output })
}

const parseLibrary = ({ input, cwd, name }) => {
    const files = getMatchingFiles(input, cwd)
    const components = parseComponents(files)
    const library = new Library({ name, components })
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

const outputLibrary = ({ library, head, body, output }) => {
    const html = compileLibrary(library, { head, body })
    mkdirp.sync(output)
    fs.writeFileSync(path.resolve(output, "index.html"), html)
}

const copyThemeFiles = ({ head, body, assets, cwd, output }) => {
    downloadRemoteAssetFiles({ assets, output })
    copyLocalAssetFiles({ assets, cwd, output })
    copyLocalHeadAndBodyFiles({ head, body, cwd, output })
}

const downloadRemoteAssetFiles = ({ assets, output }) => {
    const urlAssets = _.pickBy(assets, (to, from) => isUrl(from))
    _.forEach(urlAssets, (local, url) => downloadFile(url, path.resolve(output, local)))
}

const copyLocalAssetFiles = ({ assets, cwd, output }) => {
    const localAssets = _.pickBy(assets, (to, from) => isLocalFile(from))
    _.forEach(localAssets, async (to, from) => {
        const useSourcePath = to === true
        const src = path.resolve(cwd, from)
        const dest = path.resolve(output, useSourcePath ? from : to)
        try {
            if (isGlob(from)) {
                debug(`Copying files from "${cwd}/${from}" to "${dest}"`)
                await cpy(from, dest, { cwd })
            } else {
                debug(`Copying file from "${src}" to "${dest}"`)
                await cpFile(src, dest)
            }
        } catch (error) {
            debug(`Error copying file(s) "${cwd}/${from}" to "${dest}":`, error)
        }
    })
}

const copyLocalHeadAndBodyFiles = ({ head, body, cwd, output }) => {
    const localHeadBodyFiles = [].concat(head, body).filter(isLocalFile)
    localHeadBodyFiles.forEach(file => {
        const src = path.resolve(cwd, file)
        const dest = path.resolve(output, path.basename(file))
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
