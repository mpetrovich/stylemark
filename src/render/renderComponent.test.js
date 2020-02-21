import test from "ava"
import unified from "unified"
import parseMarkdown from "remark-parse"
import vfile from "vfile"
import renderComponent from "./renderComponent"
import Component from "../models/Component"

test("A component without specimens can be rendered", async t => {
    const markdown = `
# This is a heading

This is a paragraph.
`
    const markdownTree = unified()
        .use(parseMarkdown)
        .parse(vfile(markdown))

    const component = new Component({
        metadata: {
            name: "foo-bar",
        },
        specimens: [],
        markdown,
        markdownTree,
    })

    t.is(
        renderComponent(component),
        `<h1>This is a heading</h1>
<p>This is a paragraph.</p>`
    )
})
