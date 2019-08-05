module.exports = specimen => {
	const stylesHtml = specimen.blocks
		.filter(block => block.language === 'css')
		.map(block => `<style>${block.content}</style>`)
		.join('\n')

	const scriptsHtml = specimen.blocks
		.filter(block => block.language === 'js')
		.map(block => `<script>${block.content}</script>`)
		.join('\n')

	const renderableHtml = specimen.blocks
		.filter(block => block.language === 'html')
		.map(block => block.content)
		.join('\n')

	return `<!doctype html>
<html>
	<head><title>${specimen.name}</title></head>
<body>
${stylesHtml}
${renderableHtml}
${scriptsHtml}
</body>
</html>`
}
