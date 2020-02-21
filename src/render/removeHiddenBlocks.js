const remove = require("unist-util-remove")

module.exports = () => (tree, file) => {
    remove(tree, node => node.type === "code" && node.block.flags.includes("hidden"))
}
