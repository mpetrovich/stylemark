module.exports = content => content.replace(/^import ['"][^'"]+['"][ \t]*?/gm, '').trim()
