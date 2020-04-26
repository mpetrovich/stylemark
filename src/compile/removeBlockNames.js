const visit = require("unist-util-visit")
const parseBlockNameAndType = require("../parse/parseBlockNameAndType")

module.exports = () => (tree, file) => {
    visit(tree, "code", node => {
        const [name, type] = parseBlockNameAndType(node.lang)

        if (name) {
            node.lang = type
        }
    })
}
