module.exports = class {
    constructor({ metadata, specimens, markdown, markdownTree = null, htmlTree = null, html = "" }) {
        this.metadata = metadata
        this.specimens = specimens
        this.markdown = markdown
        this.markdownTree = markdownTree || null
        this.htmlTree = htmlTree || null
        this.html = html || ""
    }
}
