const path = require("path")

const isLocalFile = str => /^(<|https?:|:\/\/)/.test(str) === false

const getAssetTag = asset => {
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
