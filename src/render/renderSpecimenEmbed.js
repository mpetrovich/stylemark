const u = require("unist-builder")

module.exports = (h, node) => {
    return h(node, "div", [
        u("element", { tagName: "script" }, [u("text", `initializeSpecimenEmbed(${JSON.stringify(node.specimen)})`)]),
    ])
}
