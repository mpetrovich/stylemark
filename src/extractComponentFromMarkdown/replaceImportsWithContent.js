const path = require('path')
const fs = require('fs')

module.exports = (content, importFn) =>
	content.replace(/^import ['"]([^'"]+)['"][ \t]*$/gm, (match, filepath) => importFn(filepath))
