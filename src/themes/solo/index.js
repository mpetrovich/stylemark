const debug = require("debug")("stylemark:theme:solo")
const path = require("path")
const fs = require("fs-extra")
const compileComponent = require("../../compile/compileComponent")
const serialize = require("../../utils/serialize")
const getBootstrap = require("../../compile/getBootstrap")
const copyAssets = require("../../utils/copyAssets")

const theme = (library, config) => {
    const html = renderHtml(library, config)
    fs.removeSync(config.outputDir)
    saveHtml(html, config)
    copyAssets(config)
}

theme.defaultOptions = {
    title: "Stylemark",
    assetDir: "assets",
    assets: [],
}

const saveHtml = (html, config) => {
    const htmlFilepath = path.resolve(config.outputDir, "index.html")
    fs.outputFileSync(htmlFilepath, html)
}

const renderHtml = (library, config) => {
    const isLocalAsset = (asset) => /^https?:\/\//.test(asset) === false
    const isCssAsset = (asset) => /\.css$/.test(asset)
    const isJsAsset = (asset) => /\.js$/.test(asset)
    const getCssTag = (asset) => `<link rel="stylesheet" href="${asset}">`
    const getJsTag = (asset) => `<script src="${asset}"></script>`

    const getLocalAssetPath = (asset) => path.join(config.themeOptions.assetDir, path.basename(asset))
    const resolveAsset = (asset) => (isLocalAsset(asset) ? getLocalAssetPath(asset) : asset)
    const themeAssets = config.themeOptions.assets.map(resolveAsset)

    const bootstrap = getBootstrap(config)

    debug("Using config:", serialize(config))
    debug("User theme assets:", config.themeOptions.assets)
    debug("Resolved theme assets:", themeAssets)

    return `<!doctype html>
<html>
<head>
    <title>${config.themeOptions.title}</title>
    ${config.assets.filter(isCssAsset).map(getCssTag).join("\n")}
    ${themeAssets.filter(isCssAsset).map(getCssTag).join("\n")}
    <script>${bootstrap}</script>
</head>
<body>
    <nav>
        ${library.components.map((component) => `<a href="#">${component.metadata.name}</a>`).join("")}
    </nav>
    <main>
        ${library.components.map((component) => compileComponent(component, config)).join("\n")}
    </main>
    ${config.assets.filter(isJsAsset).map(getJsTag).join("\n")}
    ${themeAssets.filter(isJsAsset).map(getJsTag).join("\n")}
</body>
</html>
`
}

module.exports = theme
