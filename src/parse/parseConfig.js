const debug = require("debug")("stylemark:parse:config")
const path = require("path")
const _ = require("lodash")
const importFresh = require("import-fresh")
const uniqueString = require("unique-string")
const getMatchingFiles = require("../utils/getMatchingFiles")
const serialize = require("../utils/serialize")
const Config = require("../models/Config")
const defaultLibraryParser = require("./parseLibrary")
const defaultThemeHandler = require("../themes").solo
const defaultSpecimenHandlers = require("../specimens")

const parseConfig = (configPathOrObject) => {
    debug("Config input:", serialize(configPathOrObject))

    let userConfig, configPath

    if (typeof configPathOrObject === "string") {
        configPath = configPathOrObject
        userConfig = importFresh(configPath)
    } else {
        userConfig = configPathOrObject
    }

    debug("Raw loaded config:", serialize(userConfig))

    const basePath = userConfig.basePath || (configPath && path.dirname(configPath))
    const inputFiles = getMatchingFiles(userConfig.inputFiles, basePath)
    const outputDir = path.resolve(basePath, userConfig.outputDir)

    const isLocalAsset = (asset) => /^https?:\/\//.test(asset) === false
    const resolveAssetPath = (asset) => (isLocalAsset(asset) ? path.resolve(basePath, asset) : asset)
    const assets = (userConfig.assets || []).map(resolveAssetPath)

    const themeHandler = userConfig.themeHandler || defaultThemeHandler
    const themeOptions = Object.assign({}, themeHandler.defaultOptions, userConfig.themeOptions)
    const libraryParser = userConfig.libraryParser || defaultLibraryParser

    const specimenHandlers = _.chain([])
        .concat(userConfig.specimenHandlers, defaultSpecimenHandlers)
        .compact()
        .uniqBy("name")
        .value()
    debug("Specimen handlers:", serialize(specimenHandlers))

    return new Config({
        inputFiles,
        outputDir,
        basePath,
        assets,
        themeHandler,
        themeOptions,
        specimenHandlers,
        libraryParser,
    })
}

module.exports = parseConfig
