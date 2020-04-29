/* istanbul ignore file */

const path = require("path")
const fs = require("fs")
const mkdirp = require("mkdirp")
const getAssetTag = require("../utils/getAssetTag")
const copyMatchingFiles = require("../utils/copyMatchingFiles")
const compileComponent = require("../compile/compileComponent")

const generateStyleguide = (library, config) => {
    const themeFiles = copyThemeFiles(config)
    const html = compileLibrary(library, config, themeFiles)
    outputLibrary(html, config)
}

const copyThemeFiles = config => {
    const themeFiles = {
        logo: path.resolve(config.output, path.basename(config.themeConfig.logo)),
    }
    copyMatchingFiles(config.cwd, config.themeConfig.logo, themeFiles.logo)
    return themeFiles
}

const compileLibrary = (library, config, themeFiles) => `<!doctype html>
<html>
<head>
    <title>${library.name}</title>
    ${config.head.map(getAssetTag).join("\n")}
</head>
<body>
    <img src="${themeFiles.logo}">
    <nav>
        ${library.components.map(component => `<a href="#">${component.metadata.name}</a>`).join("")}
    </nav>
    <main>
        ${library.components.map(compileComponent).join("")}
    </main>
    ${config.body.map(getAssetTag).join("\n")}
</body>
</html>
`

const outputLibrary = (html, config) => {
    mkdirp.sync(config.output)
    fs.writeFileSync(path.resolve(config.output, "index.html"), html)
}

module.exports = generateStyleguide
