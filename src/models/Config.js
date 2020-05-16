module.exports = class {
    constructor({
        inputFiles,
        outputDir,
        basePath,
        assets,
        themeHandler,
        themeConfig,
        specimenHandlers,
        libraryParser,
        bootstrap,
    }) {
        Object.assign(this, {
            inputFiles,
            outputDir,
            basePath,
            assets,
            themeHandler,
            themeConfig,
            specimenHandlers,
            libraryParser,
            bootstrap,
        })
    }
}
