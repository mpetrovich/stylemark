module.exports = class {
    constructor({ input, output, cwd, name, head, body, assets }) {
        Object.assign(this, { input, output, cwd, name, head, body, assets })
    }
}
