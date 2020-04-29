module.exports = {
    test: specimen => specimen.blocks[0].type === "html",

    html: specimen =>
        specimen.blocks
            .filter(block => block.type === "html")
            .map(block => block.content)
            .join("\n"),

    css: specimen =>
        specimen.blocks
            .filter(block => block.type === "css")
            .map(block => block.content)
            .join("\n"),

    js: specimen =>
        specimen.blocks
            .filter(block => block.type === "js")
            .map(block => block.content)
            .join("\n"),
}
