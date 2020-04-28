module.exports = class {
    constructor({ input, output, cwd, name, head, body, assets, theme, themeOptions }) {
        Object.assign(this, { input, output, cwd, name, head, body, assets, theme, themeOptions })
    }
}
