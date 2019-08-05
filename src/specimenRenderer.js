module.exports = (specimen, { blockRenderer }) => {
	const css = specimen.blocks
		.filter(block => block.language === 'css')
		.map(blockRenderer)
		.join('\n')

	const js = specimen.blocks
		.filter(block => block.language === 'js')
		.map(blockRenderer)
		.join('\n')

	const html = specimen.blocks
		.filter(block => block.language === 'html')
		.map(blockRenderer)
		.join('\n')

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
