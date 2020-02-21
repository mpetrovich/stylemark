const unified = require("unified")
const toHtmlString = require("rehype-stringify")

module.exports = (component, { iframePathFn = null } = {}) => {
    component.htmlTree = unified().runSync(component.markdownTree)

    component.html = unified()
        .use(toHtmlString)
        .stringify(component.htmlTree)

    return component
}
