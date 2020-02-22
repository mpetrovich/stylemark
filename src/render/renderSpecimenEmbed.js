const u = require("unist-builder")

module.exports = ({ renderSpecimenFnName }) => (h, node) => {
    const id = `specimen-${node.specimen.name}`
    return h(node, "div", { id }, [
        u("element", { tagName: "script" }, [
            u("text", `${renderSpecimenFnName}("#${id}", ${JSON.stringify(node.specimen)})`),
        ]),
    ])
}
