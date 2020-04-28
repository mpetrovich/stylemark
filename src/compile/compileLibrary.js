/* istanbul ignore file */

const path = require("path")
const compileComponent = require("./compileComponent")

const isLocalFile = str => /^(<|https?:|:\/\/)/.test(str) === false

const getTag = asset => {
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

module.exports = (library, config) => {
    return `<!doctype html>
<html>
<head>
    <title>${library.name}</title>
    ${config.head.map(getTag).join("\n")}
</head>
<body>
    <img src="images/logo.png">
    <nav>
        ${library.components.map(component => `<a href="#">${component.metadata.name}</a>`).join("")}
    </nav>
    <main>
        ${library.components.map(compileComponent).join("")}
    </main>
    ${config.body.map(getTag).join("\n")}
</body>
</html>
`
}
