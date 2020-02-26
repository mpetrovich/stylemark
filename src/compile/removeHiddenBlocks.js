const remove = require("unist-util-remove")
const _ = require("lodash")

module.exports = () => (tree, file) => {
    remove(tree, node => {
        const isCodeBlock = node.type === "code"
        const flags = _.get(node, "block.flags", [])
        const isHiddenBlock = flags.includes("hidden")

        return isCodeBlock && isHiddenBlock
    })
}
