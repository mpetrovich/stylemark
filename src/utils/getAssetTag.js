const path = require("path")

const isLocalFile = (filepath) => /^(<|https?:|:\/\/)/.test(filepath) === false

const getAssetTag = (asset) => {
    if (isLocalFile(asset)) {
        asset = path.basename(asset)
    }

    if (asset.startsWith("<")) {
        return asset
    } else if (asset.endsWith(".js")) {
        return `<script src="${asset}"></script>`
    } else if (asset.endsWith(".css")) {
        return `<link rel="stylesheet" href="${asset}">`
    } else {
        return `<!-- UKNOWN ITEM: "${asset}" -->`
    }
}

module.exports = getAssetTag
