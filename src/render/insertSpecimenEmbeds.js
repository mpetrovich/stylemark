const visit = require("unist-util-visit")
const u = require("unist-builder")
const _ = require("lodash")
const parseBlockNameAndLanguage = require("../parse/parseBlockNameAndLanguage")

const isRenderableLanguage = { html: true }

module.exports = ({ component, specimenEmbedNodeName }) => (tree, file) => {
    const hasBeenInserted = {}

    visit(tree, "code", (node, index, parent) => {
        const [specimenName, language] = parseBlockNameAndLanguage(node.lang)

        if (specimenName && isRenderableLanguage[language] && !hasBeenInserted[specimenName]) {
            hasBeenInserted[specimenName] = true

            const specimen = _.find(component.specimens, { name: specimenName })
            const node = u(specimenEmbedNodeName, { specimen }, "")
            parent.children.splice(index, 0, node)

            return index + 2
        }
    })
}
