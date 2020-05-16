const htmlSpecimen = require("../src/specimens/html")

module.exports = {
    inputFiles: "**/*.md",
    outputDir: "dist/",
    themeOptions: {
        title: "Example Styleguide",
    },
    assets: ["button/button.css"],
    specimenHandlers: [
        htmlSpecimen({
            collapsedByDefault: ["html"],
            expandedByDefault: ["css", "js"],
        }),
    ],
}
