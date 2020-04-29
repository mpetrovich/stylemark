import test from "ava"
import { readFileSync } from "fs"
import parseComponent from "../parse/parseComponent"
import compileComponent from "./compileComponent"

test("A component without specimens can be compiled", async t => {
    const markdown = `
---
name: Component Name
---
# This is a heading
This is a paragraph.
`
    const component = parseComponent(markdown)

    t.is(
        compileComponent(component),
        `<h1>This is a heading</h1>
<p>This is a paragraph.</p>`
    )
})

test("A component with specimens can be compiled", async t => {
    const markdown = readFileSync(`${__dirname}/compileComponent.test/with-specimens.input.md`, { encoding: "utf8" })
    const component = parseComponent(markdown)

    t.is(
        compileComponent(component),
        `<h1>First specimen</h1>
<div><script>stylemark.initSpecimen({"name":"one","blocks":[{"specimenName":"one","type":"html","content":"<b>One</b>","flags":[],"props":{}},{"specimenName":"one","type":"js","content":"console.log('One')","flags":[],"props":{}},{"specimenName":"one","type":"css","content":"b { color: red }","flags":[],"props":{}}]})</script></div>
<pre><code class="language-html">&#x3C;b>One&#x3C;/b>
</code></pre>
<pre><code class="language-js">console.log('One')
</code></pre>
<pre><code class="language-css">b { color: red }
</code></pre>
<h1>Second specimen</h1>
<div><script>stylemark.initSpecimen({"name":"two","blocks":[{"specimenName":"two","type":"html","content":"<b>Two</b>","flags":[],"props":{}},{"specimenName":"two","type":"js","content":"console.log('Two')","flags":[],"props":{}},{"specimenName":"two","type":"css","content":"b { color: green }","flags":[],"props":{}}]})</script></div>
<pre><code class="language-html">&#x3C;b>Two&#x3C;/b>
</code></pre>
<pre><code class="language-js">console.log('Two')
</code></pre>
<pre><code class="language-css">b { color: green }
</code></pre>`
    )
})

test("Hidden specimen blocks are not compiled", async t => {
    const markdown = readFileSync(`${__dirname}/compileComponent.test/with-hidden-blocks.input.md`, {
        encoding: "utf8",
    })
    const component = parseComponent(markdown)

    t.is(
        compileComponent(component),
        `<h1>First specimen</h1>
<div><script>stylemark.initSpecimen({"name":"one","blocks":[{"specimenName":"one","type":"html","content":"<b>One</b>","flags":[],"props":{}},{"specimenName":"one","type":"js","content":"console.log('One')","flags":[],"props":{}},{"specimenName":"one","type":"css","content":"b { color: red }","flags":["hidden"],"props":{}}]})</script></div>
<pre><code class="language-html">&#x3C;b>One&#x3C;/b>
</code></pre>
<pre><code class="language-js">console.log('One')
</code></pre>
<h1>Second specimen</h1>
<div><script>stylemark.initSpecimen({"name":"two","blocks":[{"specimenName":"two","type":"html","content":"<b>Two</b>","flags":["hidden"],"props":{}},{"specimenName":"two","type":"js","content":"console.log('Two')","flags":[],"props":{}},{"specimenName":"two","type":"css","content":"b { color: green }","flags":[],"props":{}}]})</script></div>
<pre><code class="language-js">console.log('Two')
</code></pre>
<pre><code class="language-css">b { color: green }
</code></pre>`
    )
})

test("Block names are stripped when compiled", async t => {
    const markdown = readFileSync(`${__dirname}/compileComponent.test/with-named-and-unnamed-blocks.input.md`, {
        encoding: "utf8",
    })
    const component = parseComponent(markdown)

    t.is(
        compileComponent(component),
        `<h1>First specimen</h1>
<div><script>stylemark.initSpecimen({"name":"one","blocks":[{"specimenName":"one","type":"html","content":"<b>One</b>","flags":[],"props":{}}]})</script></div>
<pre><code class="language-html">&#x3C;b>One&#x3C;/b>
</code></pre>
<pre><code class="language-css">b { color: blue; }
</code></pre>
<h1>Second specimen</h1>
<div><script>stylemark.initSpecimen({"name":"two","blocks":[{"specimenName":"two","type":"html","content":"<b>Two</b>","flags":[],"props":{}}]})</script></div>
<pre><code class="language-html">&#x3C;b>Two&#x3C;/b>
</code></pre>
<pre><code class="language-js">console.log("unrelated")
</code></pre>`
    )
})

test("A single embed is inserted for specimens with multiple renderable blocks", async t => {
    const markdown = readFileSync(`${__dirname}/compileComponent.test/with-multiple-renderable-blocks.input.md`, {
        encoding: "utf8",
    })
    const component = parseComponent(markdown)

    t.is(
        compileComponent(component),
        `<h1>First specimen</h1>
<div><script>stylemark.initSpecimen({"name":"one","blocks":[{"specimenName":"one","type":"html","content":"<b>One</b>","flags":[],"props":{}},{"specimenName":"one","type":"html","content":"<b>Two</b>","flags":[],"props":{}},{"specimenName":"one","type":"css","content":"b { color: blue }","flags":[],"props":{}}]})</script></div>
<pre><code class="language-html">&#x3C;b>One&#x3C;/b>
</code></pre>
<pre><code class="language-html">&#x3C;b>Two&#x3C;/b>
</code></pre>
<pre><code class="language-css">b { color: blue }
</code></pre>`
    )
})
