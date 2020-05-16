# Stylemark &nbsp; [![npm version](https://badge.fury.io/js/stylemark.svg)](https://badge.fury.io/js/stylemark) [![Build Status](https://travis-ci.org/mpetrovich/stylemark.svg?branch=master)](https://travis-ci.org/mpetrovich/stylemark)

Generate interactive style guides from Markdown.

## Table of contents

-   [Installation](#installation)
-   [Usage](#usage)
-   [Configuration](#configuration)
-   [Concepts](#concepts)
-   [Documenting components](#documenting-components)
-   [Customization](#customization)

## Installation

Requires Node.js v10.20+

```sh
npm install stylemark
```

## Usage

### Command line

```sh
npx stylemark <config> [-w|--watch]
```

| Parameter       | Description                                      |
| --------------- | ------------------------------------------------ |
| `<config>`      | JS or JSON configuration file                    |
| `-w`, `--watch` | Launches a hot-reloading styleguide in a browser |

### Node.js

```js
const stylemark = require("stylemark")
stylemark(/* a configuration object */)
```

## Configuration

The configuration can be passed directly into Stylemark as an inline object or saved to a dedicated `.js` (recommended) or `.json` file.

```js
module.exports = {
    /*
        Base path that all paths in this config are relative to.

        When using Stylemark on the command line, this will default to the
        directory containing the config file.
    */
    basePath: "../",

    /*
        String or array of filepaths relative to `basePath` to search for component documentation.

        Globs supported, see Globbing Patterns section.
    */
    inputFiles: ["src/**/*.{js,md}", "!*.test.js"],

    /*
        Directory path relative to `basePath` the style guide will be output.

        Directories will be automatically created if they don't exist.
    */
    outputDir: "dist/styleguide",

    /*
        Elements and assets to append to the <head> tag.

        Bare URLs ending in .js or .css will be automatically wrapped in
        the appropriate <script> or <link> tags. Filepaths are resolved
        relative to the `cwd` setting above and will be automatically
        copied to the output directory.
    */
    head: [
        `<meta name="google-site-verification" content="+nxGUDJ4QpAZ5l9Bsjdi102tLVC21AIh5d1Nl23908vVuFHs34=">`,
        "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.13.0/js/all.min.js",
        "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.13.0/css/all.min.css",
    ],

    /*
        Elements and assets to append to the <body> tag.

        Bare URLs ending in .js or .css will be automatically wrapped in
        the appropriate <script> or <link> tags. Filepaths are resolved
        relative to the `cwd` setting above and will be automatically
        copied to the output directory.
    */
    body: [
        `<script>window.foo = "bar"</script>`,
        "dist/all.js",
    ],

    /*
        Static assets to copy to the output directory.

        Key:    Source path relative to the `input` setting above.
                Remote URLs will be downloaded. Globs are supported.

        Value:  Destination path relative to the `output` setting above.
                Passing `true` will use the same relative path as the key.
    */
    assets: {
        "images/logo.png": "logo.png",
        "assets/*.png": "images/",
        "robots.txt": true,
        "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.0/jquery.slim.min.js": "jquery.js"
    },

    /*
        Theme function.

        Accepts a (library, config), compiles it to HTML, and saves the result
        to the output directory. Defaults to a built-in theme.

        See Theming section.
    */
    theme: stylemark.themes.solo,

    /*
        Theme configuration passed to the theme function.

        See Theming section.
    */
    themeConfig: {
        logo: "images/logo.png",
    },

    /*
        Custom specimen types.

        See Custom Specimens section.
    */
    specimenHandlers: […]
}
```

### Globbing patterns

-   `*` matches any number of characters, but not `/`
-   `?` matches a single character, but not `/`
-   `**` matches any number of characters, including `/`, as long as it's the only thing in a path part
-   `{}` allows for a comma-separated list of "or" expressions
-   `!` at the beginning of a pattern will negate the match

## Concepts

### Block

A _block_ is a named Markdown code block.

This is a block with `button` as its name:

````md
```button.html
<button>Click me</button>
```
````

This is NOT a block because it doesn't have a name:

````md
```html
<button>Click me</button>
```
````

#### Block flags & props

A block can also have _flags_ and _props_.

Flags are listed alongside the block name. Each space-separated word is its own flag.

Props are written as a frontmatter block at the top of the Markdown code block. Note the delimiting `---` that's required before and after the props.

For example, this block:

````md
```button.html first another-flag
---
foo: bar
another prop: some value
a list:
    - one
    - two
    - three
---
<button>Click me</button>
```
````

has these flags:

```json
["first", "another-flag"]
```

and these props:

```json
{
    "foo": "bar",
    "another prop": "some value",
    "a list": ["one", "two", "three"]
}
```

### Specimens

A _specimen_ is a set of blocks that share the same name.

This is a specimen named `button` with HTML, CSS, and JS blocks:

````md
```button.html
<button>Click me</button>
```

```button.css
button { background: green }
```

```button.js
document.querySelector("button").addEventListener("click", e => alert("You clicked me!"))
```
````

### Components

A _component_ is a set of specimens documented in the same Markdown file or code comment block.

This is a component named `Button` with `hero` and `danger` specimens:

````md
---
name: Button
---

## Hero button

```hero.html
<button>Hero button</button>
```

```hero.css
button { font-size: 20px }
```

## Danger button

```danger.html
<button>Danger button</button>
```

```danger.css
button { background: red }
```
````

### Library

A _library_ is a collection of components extracted from a set of source files.

## Documenting components

Components are documented using markdown in code comments or in separate markdown files.

### In a source code comment

`button.js`:

````js
/*
---
name: Button
---

Button variants:

```variants.jsx
<Button variant="primary">Primary</Button>
<Button variant="danger">Danger</Button>
```

Button sizes:

```sizes.jsx
<Button size="s">Small</Button>
<Button size="m">Medium</Button>
<Button size="l">Large</Button>
```
*/
export default ({ variant, size, children }) => {
    return <button className={`button -${variant} -${size}`}>{children}</button>
}
````

### In a markdown file

`button.md`:

````md
---
name: Button
---

Button variants:

```variants.jsx
<Button variant="primary">Primary</Button>
<Button variant="danger">Danger</Button>
```

Button sizes:

```sizes.jsx
<Button size="s">Small</Button>
<Button size="m">Medium</Button>
<Button size="l">Large</Button>
```
````

## Customization

### Theming

A theme is a function that compiles a given `(library, config)` into HTML and saves the result to the output directory.

The simplest theme:

```js
const path = require("path")
const fs = require("fs-extra")
const compileComponent = require("stylemark/compile/compileComponent")
const getAssetTag = require("stylemark/utils/getAssetTag")

module.exports = (library, config) => {
    const html = `
        <!doctype html>
        <html>
        <head>
            <title>${library.name}</title>
            ${config.head.map(getAssetTag).join("\n")}
        </head>
        <body>
            ${library.components.map(compileComponent).join("\n")}
            ${config.body.map(getAssetTag).join("\n")}
        </body>
        </html>
    `
    fs.outputFileSync(path.resolve(config.output, "index.html"), html)
}
```

A theme has full control over how it compiles and outputs the styleguide. See [`src/themes/`](src/themes) for more examples.

### Custom specimens

New specimen types can be added via the `specimenHandlers` [configuration](#configuration) property. Custom specimen types are chosen in array order and are evaluated before Stylemark's built-in ones.

For example, let's say we want to add a new color specimen that's rendered as a color palette. We'd like to be able to document it using a new `.color` Markdown code block type like this:

````md
# Accent colors

```primary.color
#f00
```

```secondary.color
#00f
```
````

Here's how we could implement it:

```js
module.exports = {
    …
    specimenHandlers: [
        {
            /*
                Default options used for unspecified options.
            */
            defaults: {
                width: "50px",
                height: "50px",
            },

            /*
                Returns whether this specimen type can display the given specimen.
            */
            test: (specimen) => specimen.blocks[0].type === "color",

            /*
                Returns the rendered HTML for the given specimen.
            */
            renderHtml: (specimen) => `<div>${specimen.blocks[0].content}</div>`,

            /*
                Returns the rendered CSS for the given specimen.

                This will be automatically wrapped in a <style> tag. All styles are
                strictly quarantined to the local HTML, so global page styles won't
                be unaffected.
            */
            renderCss: (specimen, options) => `div {
                width: ${options.width};
                height: ${options.height};
                background: ${specimen.blocks[0].content};
            }`,

            /*
                Returns the rendered JavaScript for the given specimen.

                This will be automatically wrapped in a <script> tag. Unlike CSS
                styles this JavaScript will NOT be strictly quarantined to the
                local HTML, so it is possible to affect the global page state.

                To prevent accidental global page modifications, `document` used
                here has been overwritten to refer to the local HTML root.
                If you still need to access the global page document,
                use `window.document`.
            */
            renderJs: (specimen) => `
                document.addEventListener("click", e => navigator.clipboard.writeText("${specimen.blocks[0].content}"))
            `,
        },
    ]
})
```

### Customizing specimens

To pass options to a custom or built-in specimen type, wrap the specimen in a sub-array alongside its options object:

```js
const htmlSpecimen = require("stylemark/specimens/html")
const colorSpecimen = { defaults: …, test: …, html: …, css: …, js: … }

module.exports = {
    …
    specimenHandlers: [
        [colorSpecimen, { width: "100px", height: "100px" }],
        [htmlSpecimen, { /* any custom options */ }],
    ],
}
```
