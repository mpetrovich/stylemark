const debug = require("debug")("stylemark:theme:solo")
const path = require("path")
const fs = require("fs-extra")
const compileComponent = require("../../compile/compileComponent")
const serialize = require("../../utils/serialize")
const getBootstrap = require("../../compile/getBootstrap")
const copyAssets = require("../../utils/copyAssets")

const theme = (library, config) => {
    fs.removeSync(config.outputDir)
    const html = renderHtml(library, config)
    saveHtml(html, config)
    copyAssets(config)
}

theme.defaultOptions = {
    title: "Stylemark",
    assetDir: "assets",
    assets: [],
    headHtml: "",
    bodyHtml: "",
    htmlTag: "<html>",
    bodyTag: "<body>",
}

const saveHtml = (html, config) => {
    const htmlFilepath = path.resolve(config.outputDir, "index.html")
    fs.outputFileSync(htmlFilepath, html)
}

const renderHtml = (library, config) => {
    const isCssAsset = (asset) => /\.css$/.test(asset)
    const isJsAsset = (asset) => /\.js$/.test(asset)
    const getCssTag = (asset) => `<link rel="stylesheet" href="${asset}">`
    const getJsTag = (asset) => `<script src="${asset}"></script>`

    const isLocalAsset = (asset) => /^https?:\/\//.test(asset) === false
    const getLocalAssetPath = (asset) => path.join(config.themeOptions.assetDir, path.basename(asset))
    const resolveAsset = (asset) => (isLocalAsset(asset) ? getLocalAssetPath(asset) : asset)
    const resolvedThemeAssets = config.themeOptions.assets.map(resolveAsset)

    const bootstrap = getBootstrap(config)

    debug("Using config:", serialize(config))
    debug("User theme assets:", config.themeOptions.assets)
    debug("Resolved theme assets:", resolvedThemeAssets)

    return `<!doctype html>
${config.themeOptions.htmlTag}
<head>
    <title>${config.themeOptions.title}</title>
    ${config.assets.filter(isCssAsset).map(getCssTag).join("\n")}
    ${resolvedThemeAssets.filter(isCssAsset).map(getCssTag).join("\n")}
    <script>${bootstrap}</script>
    ${config.themeOptions.headHtml}
</head>
${config.themeOptions.bodyTag}
    <nav>
        ${library.components.map((component) => `<a href="#">${component.metadata.name}</a>`).join("")}
    </nav>
    <main>
        ${library.components.map((component) => compileComponent(component, config)).join("\n")}
    </main>
    ${config.assets.filter(isJsAsset).map(getJsTag).join("\n")}
    ${resolvedThemeAssets.filter(isJsAsset).map(getJsTag).join("\n")}
    ${config.themeOptions.bodyHtml}
</body>
</html>
`
}

module.exports = theme
