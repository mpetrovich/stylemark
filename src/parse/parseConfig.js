const debug = require("debug")("stylemark:parse:config")
const fs = require("fs")
const path = require("path")
const _ = require("lodash")
const importFresh = require("import-fresh")
const getMatchingFiles = require("../utils/getMatchingFiles")
const serialize = require("../utils/serialize")
const Config = require("../models/Config")
const defaultLibraryParser = require("./parseLibrary")
const defaultThemeHandler = require("../themes").solo
const defaultSpecimenHandlers = require("../specimens")

const parseConfig = (configPathOrObject) => {
    let config, configPath

    debug("Config input:", serialize(configPathOrObject))

    if (typeof configPathOrObject === "string") {
        configPath = configPathOrObject
        config = importFresh(configPath)
    } else {
        config = configPathOrObject
    }

    debug("Raw loaded config:", serialize(config))

    const basePath = config.basePath || (configPath && path.dirname(configPath))
    const inputFiles = getMatchingFiles(config.inputFiles, basePath)
    const outputDir = path.resolve(basePath, config.outputDir)

    const isLocalAsset = (asset) => /^https?:\/\//.test(asset) === false
    const resolveAssetPath = (asset) => (isLocalAsset(asset) ? path.resolve(basePath, asset) : asset)
    const assets = (config.assets || []).map(resolveAssetPath)

    const themeHandler = config.themeHandler || defaultThemeHandler
    const themeConfig = config.themeConfig
    const libraryParser = config.libraryParser || defaultLibraryParser
    const specimenHandlers = (config.specimenHandlers || []).concat(defaultSpecimenHandlers)
    const bootstrap = getSpecimenBootstrap(specimenHandlers) // move this

    debug("Specimen handlers:", serialize(specimenHandlers))

    return new Config({
        inputFiles,
        outputDir,
        basePath,
        assets,
        themeHandler,
        themeConfig,
        specimenHandlers,
        libraryParser,
        bootstrap,
    })
}

const getSpecimenBootstrap = (specimenHandlers) => {
    const handlers = serialize(specimenHandlers)
    const bootstrap = fs.readFileSync(path.resolve(__dirname, "../assets/specimen-bootstrap.js"), { encoding: "utf8" })
    return `; window.stylemarkSpecimenHandlers = ${handlers}; ${bootstrap};`
}

module.exports = parseConfig
