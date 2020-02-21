const unified = require("unified")
const toHtmlTree = require("remark-rehype")
const toHtmlString = require("rehype-stringify")
const insertSpecimenEmbeds = require("./insertSpecimenEmbeds")
const removeHiddenBlocks = require("./removeHiddenBlocks")

const specimenEmbedHandler = () => (h, node) => {
    return h(node, "div", {})
}

module.exports = component => {
    const htmlTree = unified()
        .use(insertSpecimenEmbeds, { component })
        .use(removeHiddenBlocks)
        .use(toHtmlTree, {
            handlers: { "specimen-embed": specimenEmbedHandler() },
        })
        .runSync(component.markdownTree)

    const html = unified()
        .use(toHtmlString)
        .stringify(htmlTree)

    return html
}
