module.exports = class {
    constructor({ input, output, cwd, name, head, body, assets, theme, themeConfig, specimenRenderers }) {
        Object.assign(this, { input, output, cwd, name, head, body, assets, theme, themeConfig, specimenRenderers })
    }
}
