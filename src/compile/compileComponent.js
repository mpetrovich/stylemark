const unified = require("unified")
const toHtmlTree = require("remark-rehype")
const toHtmlString = require("rehype-stringify")
const removeHiddenBlocks = require("./removeHiddenBlocks")
const removeBlockNames = require("./removeBlockNames")
const insertSpecimenEmbedPlaceholders = require("./insertSpecimenEmbedPlaceholders")
const replaceSpecimenEmbedPlaceholder = require("./replaceSpecimenEmbedPlaceholder")

module.exports = component => {
    const htmlTree = unified()
        .use(insertSpecimenEmbedPlaceholders, { component, specimenEmbedNodeName: "specimen-embed" })
        .use(removeHiddenBlocks)
        .use(removeBlockNames)
        .use(toHtmlTree, {
            handlers: { "specimen-embed": replaceSpecimenEmbedPlaceholder },
        })
        .runSync(component.markdownTree)

    const html = unified()
        .use(toHtmlString)
        .stringify(htmlTree)

    return html
}
