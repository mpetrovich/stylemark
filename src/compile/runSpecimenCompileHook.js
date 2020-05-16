const visit = require("unist-util-visit")

const findSpecimenHandler = (specimen, specimenHandlers) => {
    const handler = specimenHandlers.find((handler) => {
        const resolvedOptions = Object.assign({}, handler.config.defaults, handler.options)
        return handler.config.test(specimen, resolvedOptions)
    })
    return handler
}

module.exports = (config) => (tree, file) => {
    visit(tree, "specimen", (node) => {
        const handler = findSpecimenHandler(node.specimen, config.specimenHandlers)

        if (!handler) {
            return
        }

        const defaultCompileHook = () => {}
        const compileHook = handler.config.onCompile || defaultCompileHook
        compileHook(handler, config)
    })
}
