module.exports = class {
    constructor({ specimenName, language, content, flags, props }) {
        this.specimenName = specimenName
        this.language = language
        this.content = content
        this.flags = flags || []
        this.props = props || {}
    }
}
