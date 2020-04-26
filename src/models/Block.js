module.exports = class {
    constructor({ specimenName, type, content, flags, props }) {
        this.specimenName = specimenName
        this.type = type
        this.content = content
        this.flags = flags || []
        this.props = props || {}
    }
}
