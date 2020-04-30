const unified = require("unified")
const toHtmlTree = require("remark-rehype")
const toHtmlString = require("rehype-stringify")
const removeHiddenBlocks = require("./removeHiddenBlocks")
const removeBlockNames = require("./removeBlockNames")
const insertSpecimenNodes = require("./insertSpecimenNodes")
const specimenNodeToHtmlTree = require("./specimenNodeToHtmlTree")

module.exports = (component) => {
    const htmlTree = unified()
        .use(insertSpecimenNodes, component)
        .use(removeHiddenBlocks)
        .use(removeBlockNames)
        .use(toHtmlTree, {
            handlers: { specimen: specimenNodeToHtmlTree },
        })
        .runSync(component.markdownTree)

    const html = unified().use(toHtmlString).stringify(htmlTree)

    return html
}
