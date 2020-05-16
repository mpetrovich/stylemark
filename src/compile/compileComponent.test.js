const test = require("ava")
const { readFileSync } = require("fs")
const parseComponent = require("../parse/parseComponent")
const parseConfig = require("../parse/parseConfig")
const compileComponent = require("./compileComponent")

const normalizeSpecimenTags = (html) =>
    html.replace(/<stylemark-specimen-html id="[^"]+"/g, `<stylemark-specimen-html id="ID"`)

test("A component without specimens can be compiled", async (t) => {
    const markdown = `
---
name: Component Name
---
# This is a heading
This is a paragraph.
`
    const component = parseComponent(markdown)
    const config = parseConfig({})

    t.is(
        normalizeSpecimenTags(compileComponent(component, config)),
        `<h1>This is a heading</h1>
<p>This is a paragraph.</p>`
    )
})

test("A component with specimens can be compiled", async (t) => {
    const markdown = readFileSync(`${__dirname}/compileComponent.test/with-specimens.input.md`, { encoding: "utf8" })
    const component = parseComponent(markdown)
    const config = parseConfig({})

    t.is(
        normalizeSpecimenTags(compileComponent(component, config)),
        `<h1>First specimen</h1>
<stylemark-specimen-html id="ID" specimen="{&#x22;name&#x22;:&#x22;one&#x22;,&#x22;blocks&#x22;:[{&#x22;specimenName&#x22;:&#x22;one&#x22;,&#x22;type&#x22;:&#x22;html&#x22;,&#x22;content&#x22;:&#x22;<b>One</b>&#x22;,&#x22;flags&#x22;:[],&#x22;props&#x22;:{}},{&#x22;specimenName&#x22;:&#x22;one&#x22;,&#x22;type&#x22;:&#x22;js&#x22;,&#x22;content&#x22;:&#x22;console.log(&#x27;One&#x27;)&#x22;,&#x22;flags&#x22;:[],&#x22;props&#x22;:{}},{&#x22;specimenName&#x22;:&#x22;one&#x22;,&#x22;type&#x22;:&#x22;css&#x22;,&#x22;content&#x22;:&#x22;b { color: red }&#x22;,&#x22;flags&#x22;:[],&#x22;props&#x22;:{}}]}"><b>One</b></stylemark-specimen-html>
<pre><code class="language-html">&#x3C;b>One&#x3C;/b>
</code></pre>
<pre><code class="language-js">console.log('One')
</code></pre>
<pre><code class="language-css">b { color: red }
</code></pre>
<h1>Second specimen</h1>
<stylemark-specimen-html id="ID" specimen="{&#x22;name&#x22;:&#x22;two&#x22;,&#x22;blocks&#x22;:[{&#x22;specimenName&#x22;:&#x22;two&#x22;,&#x22;type&#x22;:&#x22;html&#x22;,&#x22;content&#x22;:&#x22;<b>Two</b>&#x22;,&#x22;flags&#x22;:[],&#x22;props&#x22;:{}},{&#x22;specimenName&#x22;:&#x22;two&#x22;,&#x22;type&#x22;:&#x22;js&#x22;,&#x22;content&#x22;:&#x22;console.log(&#x27;Two&#x27;)&#x22;,&#x22;flags&#x22;:[],&#x22;props&#x22;:{}},{&#x22;specimenName&#x22;:&#x22;two&#x22;,&#x22;type&#x22;:&#x22;css&#x22;,&#x22;content&#x22;:&#x22;b { color: green }&#x22;,&#x22;flags&#x22;:[],&#x22;props&#x22;:{}}]}"><b>Two</b></stylemark-specimen-html>
<pre><code class="language-html">&#x3C;b>Two&#x3C;/b>
</code></pre>
<pre><code class="language-js">console.log('Two')
</code></pre>
<pre><code class="language-css">b { color: green }
</code></pre>`
    )
})

test("Hidden specimen blocks are not compiled", async (t) => {
    const markdown = readFileSync(`${__dirname}/compileComponent.test/with-hidden-blocks.input.md`, {
        encoding: "utf8",
    })
    const component = parseComponent(markdown)
    const config = parseConfig({})

    t.is(
        normalizeSpecimenTags(compileComponent(component, config)),
        `<h1>First specimen</h1>
<stylemark-specimen-html id="ID" specimen="{&#x22;name&#x22;:&#x22;one&#x22;,&#x22;blocks&#x22;:[{&#x22;specimenName&#x22;:&#x22;one&#x22;,&#x22;type&#x22;:&#x22;html&#x22;,&#x22;content&#x22;:&#x22;<b>One</b>&#x22;,&#x22;flags&#x22;:[],&#x22;props&#x22;:{}},{&#x22;specimenName&#x22;:&#x22;one&#x22;,&#x22;type&#x22;:&#x22;js&#x22;,&#x22;content&#x22;:&#x22;console.log(&#x27;One&#x27;)&#x22;,&#x22;flags&#x22;:[],&#x22;props&#x22;:{}},{&#x22;specimenName&#x22;:&#x22;one&#x22;,&#x22;type&#x22;:&#x22;css&#x22;,&#x22;content&#x22;:&#x22;b { color: red }&#x22;,&#x22;flags&#x22;:[&#x22;hidden&#x22;],&#x22;props&#x22;:{}}]}"><b>One</b></stylemark-specimen-html>
<pre><code class="language-html">&#x3C;b>One&#x3C;/b>
</code></pre>
<pre><code class="language-js">console.log('One')
</code></pre>
<h1>Second specimen</h1>
<stylemark-specimen-html id="ID" specimen="{&#x22;name&#x22;:&#x22;two&#x22;,&#x22;blocks&#x22;:[{&#x22;specimenName&#x22;:&#x22;two&#x22;,&#x22;type&#x22;:&#x22;html&#x22;,&#x22;content&#x22;:&#x22;<b>Two</b>&#x22;,&#x22;flags&#x22;:[&#x22;hidden&#x22;],&#x22;props&#x22;:{}},{&#x22;specimenName&#x22;:&#x22;two&#x22;,&#x22;type&#x22;:&#x22;js&#x22;,&#x22;content&#x22;:&#x22;console.log(&#x27;Two&#x27;)&#x22;,&#x22;flags&#x22;:[],&#x22;props&#x22;:{}},{&#x22;specimenName&#x22;:&#x22;two&#x22;,&#x22;type&#x22;:&#x22;css&#x22;,&#x22;content&#x22;:&#x22;b { color: green }&#x22;,&#x22;flags&#x22;:[],&#x22;props&#x22;:{}}]}"><b>Two</b></stylemark-specimen-html>
<pre><code class="language-js">console.log('Two')
</code></pre>
<pre><code class="language-css">b { color: green }
</code></pre>`
    )
})

test("Block names are stripped when compiled", async (t) => {
    const markdown = readFileSync(`${__dirname}/compileComponent.test/with-named-and-unnamed-blocks.input.md`, {
        encoding: "utf8",
    })
    const component = parseComponent(markdown)
    const config = parseConfig({})

    t.is(
        normalizeSpecimenTags(compileComponent(component, config)),
        `<h1>First specimen</h1>
<stylemark-specimen-html id="ID" specimen="{&#x22;name&#x22;:&#x22;one&#x22;,&#x22;blocks&#x22;:[{&#x22;specimenName&#x22;:&#x22;one&#x22;,&#x22;type&#x22;:&#x22;html&#x22;,&#x22;content&#x22;:&#x22;<b>One</b>&#x22;,&#x22;flags&#x22;:[],&#x22;props&#x22;:{}}]}"><b>One</b></stylemark-specimen-html>
<pre><code class="language-html">&#x3C;b>One&#x3C;/b>
</code></pre>
<pre><code class="language-css">b { color: blue; }
</code></pre>
<h1>Second specimen</h1>
<stylemark-specimen-html id="ID" specimen="{&#x22;name&#x22;:&#x22;two&#x22;,&#x22;blocks&#x22;:[{&#x22;specimenName&#x22;:&#x22;two&#x22;,&#x22;type&#x22;:&#x22;html&#x22;,&#x22;content&#x22;:&#x22;<b>Two</b>&#x22;,&#x22;flags&#x22;:[],&#x22;props&#x22;:{}}]}"><b>Two</b></stylemark-specimen-html>
<pre><code class="language-html">&#x3C;b>Two&#x3C;/b>
</code></pre>
<pre><code class="language-js">console.log("unrelated")
</code></pre>`
    )
})

test("A single embed is inserted for specimens with multiple renderable blocks", async (t) => {
    const markdown = readFileSync(`${__dirname}/compileComponent.test/with-multiple-renderable-blocks.input.md`, {
        encoding: "utf8",
    })
    const component = parseComponent(markdown)
    const config = parseConfig({})

    t.is(
        normalizeSpecimenTags(compileComponent(component, config)),
        `<h1>First specimen</h1>
<stylemark-specimen-html id="ID" specimen="{&#x22;name&#x22;:&#x22;one&#x22;,&#x22;blocks&#x22;:[{&#x22;specimenName&#x22;:&#x22;one&#x22;,&#x22;type&#x22;:&#x22;html&#x22;,&#x22;content&#x22;:&#x22;<b>One</b>&#x22;,&#x22;flags&#x22;:[],&#x22;props&#x22;:{}},{&#x22;specimenName&#x22;:&#x22;one&#x22;,&#x22;type&#x22;:&#x22;html&#x22;,&#x22;content&#x22;:&#x22;<b>Two</b>&#x22;,&#x22;flags&#x22;:[],&#x22;props&#x22;:{}},{&#x22;specimenName&#x22;:&#x22;one&#x22;,&#x22;type&#x22;:&#x22;css&#x22;,&#x22;content&#x22;:&#x22;b { color: blue }&#x22;,&#x22;flags&#x22;:[],&#x22;props&#x22;:{}}]}"><b>One</b>
<b>Two</b></stylemark-specimen-html>
<pre><code class="language-html">&#x3C;b>One&#x3C;/b>
</code></pre>
<pre><code class="language-html">&#x3C;b>Two&#x3C;/b>
</code></pre>
<pre><code class="language-css">b { color: blue }
</code></pre>`
    )
})
