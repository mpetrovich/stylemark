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
<div><script>initializeSpecimenEmbed({"name":"one","blocks":[{"specimenName":"one","language":"html","content":"<b>One</b>","flags":[],"props":{}},{"specimenName":"one","language":"js","content":"console.log('One')","flags":[],"props":{}},{"specimenName":"one","language":"css","content":"b { color: red }","flags":[],"props":{}}]})</script></div>
<pre><code class="language-html">&#x3C;b>One&#x3C;/b>
</code></pre>
<pre><code class="language-js">console.log('One')
</code></pre>
<pre><code class="language-css">b { color: red }
</code></pre>
<h1>Second specimen</h1>
<div><script>initializeSpecimenEmbed({"name":"two","blocks":[{"specimenName":"two","language":"html","content":"<b>Two</b>","flags":[],"props":{}},{"specimenName":"two","language":"js","content":"console.log('Two')","flags":[],"props":{}},{"specimenName":"two","language":"css","content":"b { color: green }","flags":[],"props":{}}]})</script></div>
<pre><code class="language-html">&#x3C;b>Two&#x3C;/b>
</code></pre>
<pre><code class="language-js">console.log('Two')
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
<div><script>initializeSpecimenEmbed({"name":"one","blocks":[{"specimenName":"one","language":"html","content":"<b>One</b>","flags":[],"props":{}},{"specimenName":"one","language":"js","content":"console.log('One')","flags":[],"props":{}},{"specimenName":"one","language":"css","content":"b { color: red }","flags":["hidden"],"props":{}}]})</script></div>
<pre><code class="language-html">&#x3C;b>One&#x3C;/b>
</code></pre>
<pre><code class="language-js">console.log('One')
</code></pre>
<h1>Second specimen</h1>
<div><script>initializeSpecimenEmbed({"name":"two","blocks":[{"specimenName":"two","language":"html","content":"<b>Two</b>","flags":["hidden"],"props":{}},{"specimenName":"two","language":"js","content":"console.log('Two')","flags":[],"props":{}},{"specimenName":"two","language":"css","content":"b { color: green }","flags":[],"props":{}}]})</script></div>
<pre><code class="language-js">console.log('Two')
</code></pre>
<pre><code class="language-css">b { color: green }
</code></pre>`
    )
})
