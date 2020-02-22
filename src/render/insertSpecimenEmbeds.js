const visit = require("unist-util-visit")
const u = require("unist-builder")
const _ = require("lodash")
const parseBlockNameAndLanguage = require("../parse/parseBlockNameAndLanguage")

const isRenderableLanguage = { html: true }

module.exports = ({ component, specimenEmbedNodeName }) => (tree, file) => {
    const hasBeenInserted = {}

    visit(tree, "code", (node, index, parent) => {
        const [specimenName, language] = parseBlockNameAndLanguage(node.lang)

        if (!specimenName || !isRenderableLanguage[language] || hasBeenInserted[specimenName]) {
            return
        }

        const specimen = _.find(component.specimens, { name: specimenName })
        const specimenEmbedNode = u(specimenEmbedNodeName, { specimen }, "")
        parent.children.splice(index, 0, specimenEmbedNode)
        hasBeenInserted[specimenName] = true

        return index + 2
    })
}
