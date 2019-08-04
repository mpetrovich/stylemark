const matchAll = require('string.prototype.matchall')

module.exports = content => [...matchAll(content, /^import ['"]([^'"]+)['"][ \t]*$/gm)].map(matches => matches[1])
