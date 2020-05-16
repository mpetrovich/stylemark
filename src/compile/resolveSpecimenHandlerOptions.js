const visit = require("unist-util-visit")

module.exports = (config) => (tree, file) => {
    visit(tree, "stylemark-specimen", (node) => {
        const handler = config.specimenHandlers.find((handler) => handler.test(node.specimen))

        if (!handler || !handler.resolveOptions) {
            return
        }

        handler.options = handler.resolveOptions(config)
    })
}
