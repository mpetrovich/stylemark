const visit = require("unist-util-visit")
const u = require("unist-builder")
const _ = require("lodash")
const parseBlockNameAndType = require("../parse/parseBlockNameAndType")

const renderableBlockTypes = ["html"]

const insertNewNode = (nodes, index, nodeName, data) => {
    const node = u(nodeName, data, "")
    nodes.splice(index, 0, node)
}

module.exports = ({ component, nodeName }) => (tree, file) => {
    const specimensInsertedSoFar = new Set()

    visit(tree, "code", (node, index, parent) => {
        const [specimenName, blockType] = parseBlockNameAndType(node.lang)
        const isRenderable = renderableBlockTypes.includes(blockType)
        const wasAlreadyInserted = specimensInsertedSoFar.has(specimenName)
        const shouldBeInserted = specimenName && isRenderable && !wasAlreadyInserted

        if (!shouldBeInserted) {
            return
        }

        const specimen = _.find(component.specimens, { name: specimenName })
        insertNewNode(parent.children, index, nodeName, { specimen })
        specimensInsertedSoFar.add(specimenName)
        return index + 2
    })
}
