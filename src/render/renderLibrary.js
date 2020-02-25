const fs = require("fs")
const path = require("path")
const renderComponent = require("./renderComponent")

module.exports = library => `<!doctype html>
<html>
<head>
    <title>${library.name}</title>
	<script>${fs.readFileSync(path.resolve(__dirname, "initializeSpecimenEmbed.js"), { encoding: "utf8" })}</script>
</head>
<body>
	${library.components.map(renderComponent).join("")}
</body>
</html>
`
