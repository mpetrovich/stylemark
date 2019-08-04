const matchAll = require('string.prototype.matchall')

module.exports = content =>
	[...matchAll(content.trim(), /^\s*import ['"]([^'"]+)['"]\s*$/gm)].map(matches => matches[1])
