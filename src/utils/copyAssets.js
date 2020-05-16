const debug = require("debug")("stylemark:compile")
const path = require("path")
const fs = require("fs-extra")

module.exports = (config) => {
    const isLocalAsset = (asset) => /^https?:\/\//.test(asset) === false
    const copyLocalAsset = (srcPath) => {
        try {
            const destPath = path.resolve(config.outputDir, config.themeOptions.assetDir, path.basename(srcPath))
            debug(`Copying local asset from "${srcPath}" to "${destPath}"`)
            fs.copySync(srcPath, destPath)
        } catch (error) {
            debug(`Error copying asset "${srcPath}": ${error.message}`)
        }
    }
    const assets = [].concat(config.assets, config.themeOptions.assets)
    assets.filter(isLocalAsset).forEach(copyLocalAsset)
}
