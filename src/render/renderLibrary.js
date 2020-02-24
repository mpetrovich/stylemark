const renderComponent = require("./renderComponent")

module.exports = library => `<!doctype html>
<html>
<head>
    <title>${library.name}</title>
	<script src="../src/render/initializeSpecimenEmbed.js"></script>
</head>
<body>
	${library.components.map(renderComponent).join("")}
</body>
</html>
`
