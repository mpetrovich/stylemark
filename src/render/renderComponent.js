const unified = require("unified")
const toHtmlString = require("rehype-stringify")
const _ = require("lodash")
const Component = require("../models/Component")
const insertSpecimenEmbeds = require("./insertSpecimenEmbeds")
const removeHiddenBlocks = require("./removeHiddenBlocks")

module.exports = component => {
    const htmlTree = unified()
        .use(insertSpecimenEmbeds, { component })
        .use(removeHiddenBlocks)
        .runSync(component.markdownTree)

    const html = unified()
        .use(toHtmlString)
        .stringify(component.htmlTree)

    return new
}
