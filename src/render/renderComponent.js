const unified = require("unified")
const toHtmlTree = require("remark-rehype")
const toHtmlString = require("rehype-stringify")
const removeHiddenBlocks = require("./removeHiddenBlocks")
const removeBlockNames = require("./removeBlockNames")
const insertSpecimenEmbeds = require("./insertSpecimenEmbeds")
const renderSpecimenEmbed = require("./renderSpecimenEmbed")

module.exports = component => {
    const nodeName = "specimen-embed"
    const htmlTree = unified()
        .use(insertSpecimenEmbeds, { component, nodeName })
        .use(removeHiddenBlocks)
        .use(removeBlockNames)
        .use(toHtmlTree, {
            handlers: { [nodeName]: renderSpecimenEmbed("attachSpecimen") },
        })
        .runSync(component.markdownTree)

    const html = unified()
        .use(toHtmlString)
        .stringify(htmlTree)

    return html
}
