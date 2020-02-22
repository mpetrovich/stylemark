import test from "ava"
import { readFileSync } from "fs"
import parseComponent from "../parse/parseComponent"
import renderComponent from "./renderComponent"

test("A component without specimens can be rendered", async t => {
    const markdown = `
---
name: Component Name
---
# This is a heading
This is a paragraph.
`
    const component = parseComponent(markdown)

    t.is(
        renderComponent(component),
        `<h1>This is a heading</h1>
<p>This is a paragraph.</p>`
    )
})

test("A component with specimens can be rendered", async t => {
    const markdown = readFileSync(`${__dirname}/renderComponent.test/with-specimens.input.md`, { encoding: "utf8" })
    const component = parseComponent(markdown)

    t.is(
        renderComponent(component),
        `<h1>First specimen</h1>
<div id="specimen-one"></div>
<pre><code class="language-html">&#x3C;b>One&#x3C;/b>
</code></pre>
<pre><code class="language-css">b { color: red }
</code></pre>
<h1>Second specimen</h1>
<div id="specimen-two"></div>
<pre><code class="language-html">&#x3C;b>Two&#x3C;/b>
</code></pre>
<pre><code class="language-css">b { color: green }
</code></pre>`
    )
})

test("Hidden specimen blocks are not rendered", async t => {
    const markdown = readFileSync(`${__dirname}/renderComponent.test/with-hidden-blocks.input.md`, { encoding: "utf8" })
    const component = parseComponent(markdown)

    t.is(
        renderComponent(component),
        `<h1>First specimen</h1>
<div id="specimen-one"></div>
<pre><code class="language-html">&#x3C;b>One&#x3C;/b>
</code></pre>
<h1>Second specimen</h1>
<div id="specimen-two"></div>
<pre><code class="language-css">b { color: green }
</code></pre>`
    )
})
