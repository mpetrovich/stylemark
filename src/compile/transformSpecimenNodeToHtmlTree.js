const u = require("unist-builder")
const uniqueString = require("unique-string")

module.exports = (config) => (h, node) => {
    const handler = config.specimenHandlers.find((handler) => handler.test(node.specimen))

    if (!handler) {
        debug("No matching handler found for specimen:", node.specimen)
        return
    }

    const specimenId = uniqueString()
    const serializedSpecimen = JSON.stringify(node.specimen)
    const html = handler.render(node.specimen)

    return h(node, `stylemark-specimen-${handler.name}`, { id: specimenId, specimen: serializedSpecimen }, [
        u("raw", `<div>${html}</div>`),
    ])
}
