const debug = require("debug")("stylemark:processor")
const fs = require("fs-extra")
const fetch = require("node-fetch")
const path = require("path")
const _ = require("lodash")
const Config = require("./models/Config")
const Library = require("./models/Library")
const getMatchingFiles = require("./utils/getMatchingFiles")
const copyMatchingFiles = require("./utils/copyMatchingFiles")
const extractCommentBlocks = require("./parse/extractCommentBlocks")
const parseComponent = require("./parse/parseComponent")
const defaultTheme = require("./themes/solo")

const requiredHeadAssets = [path.resolve(__dirname, "assets/bootstrap.js"), `<script src="renderers.js"></script>`]
const defaultSpecimenRenderers = [require("./specimens/html")]

const stylemark = ({
    input,
    output,
    cwd,
    name,
    head = [],
    body = [],
    assets = [],
    theme = defaultTheme,
    themeConfig = {},
    specimenRenderers = [],
}) => {
    const config = new Config({
        input,
        output: path.resolve(cwd, output),
        cwd,
        name,
        head: head.concat(requiredHeadAssets),
        body,
        assets,
        theme,
        themeConfig,
        specimenRenderers: specimenRenderers.concat(defaultSpecimenRenderers),
    })
    debug("Using config", config)
    const library = parseLibrary(config)
    debug("Parsed library", JSON.stringify(library))
    theme(library, config)
    copyThemeFiles(config)
    outputRenderers(config)
}

const parseLibrary = (config) => {
    const files = getMatchingFiles(config.input, config.cwd)
    const components = parseComponents(files)
    const library = new Library({ name: config.name, components })
    return library
}

const parseComponents = (files) => {
    const components = _.flatMap(files, (file) => {
        const content = fs.readFileSync(file, { encoding: "utf8" })
        const isMarkdownFile = file.endsWith(".md") || file.endsWith(".markdown")
        return isMarkdownFile ? parseComponent(content) : extractCommentBlocks(content).map(parseComponent)
    })
    return components
}

const copyThemeFiles = (config) => {
    downloadRemoteUrls(config)
    copyLocalFiles(config)
    copyLocalHeadAndBodyFiles(config)
}

const downloadRemoteUrls = (config) => {
    const urls = _.pickBy(config.assets, (to, from) => isUrl(from))
    _.forEach(urls, (local, url) => downloadFile(url, path.resolve(config.output, local)))
}

const copyLocalFiles = (config) => {
    const localFiles = _.pickBy(config.assets, (to, from) => isLocalFile(from))
    _.forEach(localFiles, async (to, from) => {
        to = path.resolve(config.output, to === true ? from : to)
        copyMatchingFiles(config.cwd, from, to)
    })
}

const copyLocalHeadAndBodyFiles = (config) => {
    const localHeadBodyFiles = [].concat(config.head, config.body).filter(isLocalFile)
    localHeadBodyFiles.forEach((file) => {
        const to = path.resolve(config.output, path.basename(file))
        copyMatchingFiles(config.cwd, file, to)
    })
}

const isLocalFile = (str) => str && /^(<|https?:|:\/\/)/.test(str) === false
const isUrl = (str) => /^https?:\/\//.test(str)

const downloadFile = async (url, to) => {
    try {
        const response = await fetch(url)
        const stream = fs.createWriteStream(to)
        response.body.pipe(stream)
    } catch (error) {
        debug(`Error downloading URL "${url}" to file "${to}":`, error)
    }
}

const outputRenderers = (config) => {
    const renderersFile = path.resolve(config.output, "renderers.js")
    debug("Saving specimen renderers to:", renderersFile)
    fs.outputFileSync(
        renderersFile,
        `window.stylemark.renderers = [${config.specimenRenderers
            .map(
                (renderer) => `{
                    ${_.map(renderer, (fn, name) => `${name}: ${fn.toString()}`).join(",")}
                }`
            )
            .join(",")}]`
    )
}

module.exports = stylemark
module.exports.Config = require("./models/Config")
module.exports.Block = require("./models/Block")
module.exports.Component = require("./models/Component")
module.exports.Specimen = require("./models/Specimen")
module.exports.Library = require("./models/Library")
module.exports.parseComponent = require("./parse/parseComponent")
module.exports.compileComponent = require("./compile/compileComponent")
module.exports.getMatchingFiles = require("./utils/getMatchingFiles")
module.exports.copyMatchingFiles = require("./utils/copyMatchingFiles")
module.exports.getAssetTag = require("./utils/getAssetTag")
module.exports.themes = {
    solo: require("./themes/solo"),
}
module.exports.specimenRenderers = defaultSpecimenRenderers
