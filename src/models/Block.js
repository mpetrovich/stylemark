module.exports = class {
    constructor({ specimenName, type, content, flags = [], props = {} }) {
        Object.assign(this, { specimenName, type, content, flags, props })
    }
}
