const u = require("unist-builder")
const uniqueString = require("unique-string")

module.exports = (config) => (h, node) => {
    const handler = config.specimenHandlers.find((handler) => handler.test(node.specimen))
    const id = uniqueString()
    const serializedSpecimen = JSON.stringify(node.specimen)
    const htmlBlock = node.specimen.blocks.find((block) => block.type === "html")
    const html = htmlBlock ? htmlBlock.content : ""
    return h(node, `stylemark-specimen-${handler.name}`, { id, specimen: serializedSpecimen }, [
        u("raw", `<div>${html}</div>`),
    ])
}
