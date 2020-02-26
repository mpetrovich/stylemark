const unified = require("unified")
const toHtmlTree = require("remark-rehype")
const toHtmlString = require("rehype-stringify")
const removeHiddenBlocks = require("./removeHiddenBlocks")
const removeBlockNames = require("./removeBlockNames")
const insertSpecimenEmbeds = require("./insertSpecimenEmbeds")
const compileSpecimenEmbed = require("./compileSpecimenEmbed")

module.exports = component => {
    const htmlTree = unified()
        .use(insertSpecimenEmbeds, { component, specimenEmbedNodeName: "specimen-embed" })
        .use(removeHiddenBlocks)
        .use(removeBlockNames)
        .use(toHtmlTree, {
            handlers: { "specimen-embed": compileSpecimenEmbed },
        })
        .runSync(component.markdownTree)

    const html = unified()
        .use(toHtmlString)
        .stringify(htmlTree)

    return html
}
