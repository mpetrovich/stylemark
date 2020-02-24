const matchAll = require("string.prototype.matchall")

module.exports = content => {
    content = content.replace(/\r\n/g, "\n") // Replaces Windows line breaks
    const matches = matchAll(content, /\/\*+\n([\s\S]+?)\n\*+\//g)
    const commentBlocks = Array.from(matches, match => match[1])
    return commentBlocks
}
