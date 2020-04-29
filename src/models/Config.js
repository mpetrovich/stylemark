module.exports = class {
    constructor({ input, output, cwd, name, head, body, assets, theme, themeConfig }) {
        Object.assign(this, { input, output, cwd, name, head, body, assets, theme, themeConfig })
    }
}
