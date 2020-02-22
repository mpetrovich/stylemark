const unified = require("unified")
const toHtmlTree = require("remark-rehype")
const toHtmlString = require("rehype-stringify")
const removeHiddenBlocks = require("./removeHiddenBlocks")
const removeBlockNames = require("./removeBlockNames")
const insertSpecimenEmbeds = require("./insertSpecimenEmbeds")
const renderSpecimen = require("./renderSpecimen")

module.exports = component => {
    const embedNodeName = "specimen-embed"
    const htmlTree = unified()
        .use(insertSpecimenEmbeds, { component, embedNodeName })
        .use(removeHiddenBlocks)
        .use(removeBlockNames)
        .use(toHtmlTree, {
            handlers: { [embedNodeName]: renderSpecimen },
        })
        .runSync(component.markdownTree)

    const html = unified()
        .use(toHtmlString)
        .stringify(htmlTree)

    return html
}
