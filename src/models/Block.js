module.exports = class {
    constructor({ specimenName, language, displayContent, executableContent, flags, props }) {
        this.specimenName = specimenName
        this.language = language
        this.displayContent = displayContent
        this.executableContent = executableContent || ""
        this.flags = flags || []
        this.props = props || {}
    }
}
