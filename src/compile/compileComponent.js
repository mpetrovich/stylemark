const unified = require("unified")
const toHtmlTree = require("remark-rehype")
const toHtmlString = require("rehype-stringify")
const removeHiddenBlocks = require("./removeHiddenBlocks")
const removeBlockNames = require("./removeBlockNames")
const insertSpecimenNodes = require("./insertSpecimenNodes")
const transformSpecimenNodeToHtmlTree = require("./transformSpecimenNodeToHtmlTree")

module.exports = (component, config) => {
    const htmlTree = unified()
        .use(insertSpecimenNodes, component)
        .use(removeHiddenBlocks)
        .use(removeBlockNames)
        .use(toHtmlTree, {
            handlers: { "stylemark-specimen": transformSpecimenNodeToHtmlTree(config) },
        })
        .runSync(component.markdownTree)

    const html = unified()
        .use(toHtmlString, {
            allowDangerousHtml: true,
        })
        .stringify(htmlTree)

    return html
}
