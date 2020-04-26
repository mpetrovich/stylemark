const fs = require("fs")
const path = require("path")
const compileComponent = require("./compileComponent")

const initSpecimenEmbedScript = fs.readFileSync(path.resolve(__dirname, "..", "assets", "initializeSpecimenEmbed.js"), {
    encoding: "utf8",
})

module.exports = library => `<!doctype html>
<html>
<head>
    <title>${library.name}</title>
    <script>${initSpecimenEmbedScript}</script>
</head>
<body>
    <nav>
        ${library.components.map(component => `<a href="#">${component.metadata.name}</a>`).join("")}
    </nav>
    <main>
        ${library.components.map(compileComponent).join("")}
    </main>
</body>
</html>
`
