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
	<script crossorigin src="https://unpkg.com/react@16/umd/react.production.min.js"></script>
	<script crossorigin src="https://unpkg.com/react-dom@16/umd/react-dom.production.min.js"></script>
	<script>${initSpecimenEmbedScript}</script>
</head>
<body>
	${library.components.map(compileComponent).join("")}
</body>
</html>
`
