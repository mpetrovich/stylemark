const unified = require("unified")
const toHtmlTree = require("remark-rehype")
const toHtmlString = require("rehype-stringify")
const addSpecimenEmbeds = require("../transform/addSpecimenEmbeds")
const removeHiddenBlocks = require("../transform/removeHiddenBlocks")

const specimenEmbedHandler = ({ iframePathFn }) => (h, node) => {
    if (iframePathFn) {
        return h(node, "iframe", {
            src: iframePathFn({
                component: node.component,
                specimen: node.specimen,
            }),
        })
    } else {
        return null
    }
}

module.exports = (component, { iframePathFn = null } = {}) => {
    component.htmlTree = unified()
        .use(addSpecimenEmbeds, { component })
        .use(removeHiddenBlocks)
        .use(toHtmlTree, {
            handlers: { "specimen-embed": specimenEmbedHandler({ iframePathFn }) },
        })
        .runSync(component.markdownTree)

    component.html = unified()
        .use(toHtmlString)
        .stringify(component.htmlTree)

    return component
}
