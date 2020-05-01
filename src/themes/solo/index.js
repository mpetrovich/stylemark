const path = require("path")
const fs = require("fs-extra")
const getAssetTag = require("../../utils/getAssetTag")
const copyMatchingFiles = require("../../utils/copyMatchingFiles")
const compileComponent = require("../../compile/compileComponent")

module.exports = (library, config) => {
    const logoPath = path.resolve(config.output, path.basename(config.themeConfig.logo))
    copyMatchingFiles(config.themeConfig.logo, logoPath, config.cwd)

    const html = `<!doctype html>
<html>
<head>
    <title>${library.name}</title>
    ${config.head.map(getAssetTag).join("\n")}
</head>
<body>
    <img src="${path.relative(config.output, logoPath)}">
    <nav>
        ${library.components.map((component) => `<a href="#">${component.metadata.name}</a>`).join("")}
    </nav>
    <main>
        ${library.components.map(compileComponent).join("\n")}
    </main>
    ${config.body.map(getAssetTag).join("\n")}
</body>
</html>
`
    fs.outputFileSync(path.resolve(config.output, "index.html"), html)
}