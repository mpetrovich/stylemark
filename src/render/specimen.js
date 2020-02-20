module.exports = (specimen, { renderBlock }) => {
    const css = specimen.blocks
        .filter(block => block.language === "css")
        .map(renderBlock)
        .join("\n")

    const js = specimen.blocks
        .filter(block => block.language === "js")
        .map(renderBlock)
        .join("\n")

    const html = specimen.blocks
        .filter(block => block.language === "html")
        .map(renderBlock)
        .join("\n")

    return `<!doctype html>
<html>
	<head>
		<title>${specimen.name}</title>
	</head>
	<body>
		${css}
		${html}
		${js}
	</body>
</html>`
}
