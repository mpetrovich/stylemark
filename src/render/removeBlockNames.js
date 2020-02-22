const visit = require("unist-util-visit")
const parseBlockNameAndLanguage = require("../parse/parseBlockNameAndLanguage")

module.exports = () => (tree, file) => {
    visit(tree, "code", node => {
        const [name, language] = parseBlockNameAndLanguage(node.lang)

        if (name) {
            node.lang = language
        }
    })
}
