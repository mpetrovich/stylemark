// Copy and modify this to your needs

const path = require("path")
const fs = require("fs-extra")
const { compileComponent, getAssetTag } = require("../stylemark")

module.exports = (library, config) => {
    const html = `<!doctype html>
<html>
<head>
    <title>${library.name}</title>
    ${config.head.map(getAssetTag).join("\n")}
</head>
<body>
    ${library.components.map(compileComponent).join("\n")}
    ${config.body.map(getAssetTag).join("\n")}
</body>
</html>
`
    fs.outputFileSync(path.resolve(config.output, "index.html"), html)
}
