module.exports = (h, node) => {
    return h(node, "div", { id: `specimen-${node.specimen.name}` })
}
