const debug = require("debug")("stylemark:theme:solo")
const path = require("path")
const fs = require("fs-extra")
const compileComponent = require("../../compile/compileComponent")
const Config = require("../../models/Config")

const theme = (library, userConfig) => {
    const config = resolveConfig(userConfig)
    saveHtml(library, config)
    saveAssets(config)
}

const resolveConfig = (config) => {
    const defaultThemeConfig = { assetDir: "assets", title: "Stylemark" }
    const themeConfig = Object.assign({}, defaultThemeConfig, config.themeConfig)
    return new Config({ ...config, themeConfig })
}

const isLocalAsset = (asset) => /^https?:\/\//.test(asset) === false

const saveHtml = (library, config) => {
    const htmlFilepath = path.resolve(config.outputDir, "index.html")
    const html = renderHtml(library, config)
    fs.outputFileSync(htmlFilepath, html)
}

const saveAssets = (config) => {
    const saveLocalAsset = (localAsset) => {
        try {
            const assetDest = path.resolve(config.outputDir, config.themeConfig.assetDir, path.basename(localAsset))
            debug(`Copying local asset from "${localAsset}" to "${assetDest}"`)
            fs.copySync(localAsset, assetDest)
        } catch (error) {
            debug(`Error copying asset "${localAsset}": ${error.message}`)
        }
    }
    config.assets.filter(isLocalAsset).forEach(saveLocalAsset)
}

const renderHtml = (library, config) => {
    const isCssAsset = (asset) => /\.css$/.test(asset)
    const isJsAsset = (asset) => /\.js$/.test(asset)
    const getCssTag = (asset) => `<link rel="stylesheet" href="${asset}">`
    const getJsTag = (asset) => `<script src="${asset}"></script>`

    const getLocalAssetPath = (asset) => path.join(config.themeConfig.assetDir, path.basename(asset))
    const getAssetUri = (asset) => (isLocalAsset(asset) ? getLocalAssetPath(asset) : asset)
    const assets = config.assets.map(getAssetUri)

    debug("Using config:", config)
    debug("Input assets:", config.assets)
    debug("Output assets:", assets)

    return `<!doctype html>
<html>
<head>
    <title>${config.themeConfig.title}</title>
    ${assets.filter(isCssAsset).map(getCssTag).join("\n")}
    <script>${config.bootstrap}</script>
</head>
<body>
    <nav>
        ${library.components.map((component) => `<a href="#">${component.metadata.name}</a>`).join("")}
    </nav>
    <main>
        ${library.components.map((component) => compileComponent(component, config)).join("\n")}
    </main>
    ${assets.filter(isJsAsset).map(getJsTag).join("\n")}
</body>
</html>
`
}

module.exports = theme
