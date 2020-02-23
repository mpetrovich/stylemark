const u = require("unist-builder")
const babel = require("babel-core")

module.exports = (h, node) => {
    node.specimen.blocks
        .filter(block => block.language === "jsx")
        .forEach(block => {
            block.compiledContent = babel.transform(block.content, { presets: ["babel-preset-react"] }).code
        })

    return h(node, "div", [
        u("element", { tagName: "script" }, [u("text", `initializeSpecimenEmbed(${JSON.stringify(node.specimen)})`)]),
    ])
}
