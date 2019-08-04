module.exports = content =>
	content
		.trim()
		.replace(/^\s*import ['"][^'"]+['"]\s*?/gm, '')
		.trim()
