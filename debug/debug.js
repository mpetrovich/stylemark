#!/usr/bin/env node

/* istanbul ignore file */

const fs = require("fs")
const parseComponent = require("../src/parse/parseComponent")
const renderComponent = require("../src/render/renderComponent")

const markdown = fs.readFileSync(`${__dirname}/debug.md`, { encoding: "utf8" })
const component = parseComponent(markdown)
const html = renderComponent(component)

fs.writeFileSync(
    `${__dirname}/debug.html`,
    `<!doctype html>
<html>
<head>
	<script src="../src/render/attachSpecimen.js"></script>
</head>
<body>
	${html}
</body>
</html>
`
)