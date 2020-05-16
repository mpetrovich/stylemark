const debug = require("debug")("stylemark:compile")
const path = require("path")
const fs = require("fs-extra")

module.exports = (config) => {
    const isLocalAsset = (asset) => /^https?:\/\//.test(asset) === false
    const saveLocalAsset = (localAsset) => {
        try {
            const assetDest = path.resolve(config.outputDir, config.themeOptions.assetDir, path.basename(localAsset))
            debug(`Copying local asset from "${localAsset}" to "${assetDest}"`)
            fs.copySync(localAsset, assetDest)
        } catch (error) {
            debug(`Error copying asset "${localAsset}": ${error.message}`)
        }
    }
    const assets = [].concat(config.assets, config.themeOptions.assets)
    assets.filter(isLocalAsset).forEach(saveLocalAsset)
}
