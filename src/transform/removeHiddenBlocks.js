const remove = require("unist-util-remove")
const _ = require("lodash")

module.exports = () => (tree, file) => {
    remove(tree, node => node.type === "code" && _.get(node, "block.flags.hidden", false))
}
