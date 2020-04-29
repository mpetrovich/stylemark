const u = require("unist-builder")

module.exports = (h, node) => {
    return h(node, "div", [
        u("element", { tagName: "script" }, [u("text", `stylemark.renderSpecimen(${JSON.stringify(node.specimen)})`)]),
    ])
}
