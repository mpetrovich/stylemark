module.exports = class {
    constructor({
        inputFiles,
        outputDir,
        basePath,
        assets,
        themeHandler,
        themeOptions,
        specimenHandlers,
        libraryParser,
    }) {
        Object.assign(this, {
            inputFiles,
            outputDir,
            basePath,
            assets,
            themeHandler,
            themeOptions,
            specimenHandlers,
            libraryParser,
        })
    }
}
