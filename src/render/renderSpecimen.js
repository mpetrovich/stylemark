const u = require("unist-builder")

module.exports = (h, node) => {
    const id = `specimen-${node.specimen.name}`
    return h(node, "div", { id }, [
        u("element", { tagName: "script" }, [u("text", `attachSpecimen("#${id}", ${JSON.stringify(node.specimen)})`)]),
    ])
}
