const debug = require("debug")("stylemark:main")
const fs = require("fs-extra")
const parseConfig = require("./parse/parseConfig")

module.exports = (configPathOrObject) => {
    debug("Input config:", JSON.stringify(configPathOrObject))

    const config = parseConfig(configPathOrObject)
    debug("Parsed config:", JSON.stringify(config))

    const library = config.libraryParser(config.inputFiles)
    debug("Parsed library:", JSON.stringify(library))

    config.themeHandler(library, config)

    return config
}
