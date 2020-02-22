const u = require("unist-builder")
const babel = require("babel-core")

module.exports = ({ renderSpecimenFnName }) => (h, node) => {
    node.specimen.blocks
        .filter(block => block.language === "jsx")
        .forEach(block => {
            block.compiledContent = babel.transform(block.content, { presets: ["babel-preset-react"] }).code
        })

    const id = `specimen-${node.specimen.name}`
    return h(node, "div", { id }, [
        u("element", { tagName: "script" }, [
            u("text", `${renderSpecimenFnName}("#${id}", ${JSON.stringify(node.specimen)})`),
        ]),
    ])
}
