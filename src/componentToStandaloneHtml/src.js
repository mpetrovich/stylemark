const specimenToInlineHtml = require('../specimenToInlineHtml/src')

module.exports = (component, { specimenToHtml = specimenToInlineHtml } = {}) => {
	const specimensHtml = component.specimens.map(specimenToHtml).join('\n')

	return `<!doctype html>
<html>
<head><title>${component.meta.name}</title></head>
<body>
${specimensHtml}
</body>
</html>`
}
