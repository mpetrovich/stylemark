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
	${library.components.map(compileComponent).join("")}
</body>
</html>
`
