const u = require("unist-builder")

module.exports = renderFnName => (h, node) => {
    const id = `specimen-${node.specimen.name}`
    return h(node, "div", { id }, [
        u("element", { tagName: "script" }, [u("text", `${renderFnName}("#${id}", ${JSON.stringify(node.specimen)})`)]),
    ])
}
