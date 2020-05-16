const htmlSpecimen = require("../src/specimens/html")

module.exports = {
    inputFiles: "**/*.md",
    outputDir: "dist/",
    themeConfig: {
        title: "Example Styleguide",
    },
    assets: ["button/button.css", "button/button.js"],
}
