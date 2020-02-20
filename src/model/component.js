module.exports = class {
    constructor({ metadata, specimens, markdown, markdownTree, htmlTree, html }) {
        this.metadata = metadata
        this.specimens = specimens
        this.markdown = markdown
        this.markdownTree = markdownTree || null
        this.htmlTree = htmlTree || null
        this.html = html || ""
    }
}
