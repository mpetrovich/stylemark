const u = require("unist-builder")

module.exports = (h, node) => {
    return h(node, "div", [
        u("element", { tagName: "script" }, [u("text", `stylemark.initSpecimen(${JSON.stringify(node.specimen)})`)]),
    ])
}
