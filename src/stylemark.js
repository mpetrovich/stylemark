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
const defaultSpecimenTypes = require("./specimens/all")
const requiredHeadAssets = [path.resolve(__dirname, "assets/bootstrap.js"), `<script src="specimen-types.js"></script>`]

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
    specimenTypes = [],
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
        specimenTypes: specimenTypes.concat(Object.values(defaultSpecimenTypes)),
    })
    debug("Using config", config)
    const library = parseLibrary(config)
    debug("Parsed library", JSON.stringify(library))
    theme(library, config)
    copyThemeFiles(config)
    outputSpecimenTypes(config)
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
        copyMatchingFiles(from, to, config.cwd)
    })
}

const copyLocalHeadAndBodyFiles = (config) => {
    const localHeadBodyFiles = [].concat(config.head, config.body).filter(isLocalFile)
    localHeadBodyFiles.forEach((file) => {
        const to = path.resolve(config.output, path.basename(file))
        copyMatchingFiles(file, to, config.cwd)
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

const outputSpecimenTypes = (config) => {
    const filepath = path.resolve(config.output, "specimen-types.js")
    debug("Saving specimen types to:", filepath)

    const serializeArray = (array) => `[
        ${array.map((item) => (Array.isArray(item) ? serializeArray(item) : serializeObject(item))).join(",")}
    ]`
    const serializeObject = (object) => `{
        ${_.map(object, (value, key) => `${key}: ${serializeValue(value)}`).join(",")}
    }`
    const serializeValue = (value) => (_.isFunction(value) ? value.toString() : JSON.stringify(value))

    const specimenTypesSerialized = serializeArray(config.specimenTypes)
    fs.outputFileSync(filepath, `window.stylemark.specimenTypes = ${specimenTypesSerialized}`)
}

module.exports = stylemark
