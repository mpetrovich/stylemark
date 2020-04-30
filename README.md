# Stylemark &nbsp; [![npm version](https://badge.fury.io/js/stylemark.svg)](https://badge.fury.io/js/stylemark) [![Build Status](https://travis-ci.org/mpetrovich/stylemark.svg?branch=master)](https://travis-ci.org/mpetrovich/stylemark)

Generate interactive style guides from Markdown.

## Table of contents

-   [Installation](#installation)
-   [Usage](#usage)
-   [Configuration](#configuration)
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

stylemark(/* see configuration below */)
```

## Configuration

```js
{
    /*
        Base path that all paths in this config are relative to.

        When using Stylemark on the command line, this will default to the
        directory containing the config file.
    */
    cwd: "../",

    /*
        String or array of filepath globs.

        See globbing patterns below.
    */
    input: ["src/**/*.{js,md}", "!*.test.js"],

    /*
        Output directory path.

        Directories will be automatically created if they don't exist.
    */
    output: "dist/styleguide",

    /*
        Display name of the generated styleguide.
    */
    name: "ACME Styleguide",

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

        See theming below.
    */
    theme: stylemark.themes.solo,

    /*
        Theme configuration passed to the theme function.

        See theming below.
    */
    themeConfig: {
        logo: "images/logo.png",
    },

    /*
        Custom specimen renderers.

        See custom specimens below.
    */
    specimenRenderers: [
        {
            test: specimen => specimen.blocks[0].type === "color",
            html: specimen => `<div>${specimen.blocks[0].content}</div>`,
            css: specimen => `div {
                width: 50px;
                height: 50px;
                background: ${specimen.blocks[0].content};
            }`,
            js: (specimen) => `
                document.addEventListener("click", e => navigator.clipboard.writeText("${specimen.blocks[0].content}"))
            `,
        },
    ]
}
```

### Globbing patterns

-   `*` matches any number of characters, but not `/`
-   `?` matches a single character, but not `/`
-   `**` matches any number of characters, including `/`, as long as it's the only thing in a path part
-   `{}` allows for a comma-separated list of "or" expressions
-   `!` at the beginning of a pattern will negate the match

## Documenting components

Components are documented using markdown in code comments or in separate markdown files. [See the docs](docs/components.md) for details.

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
const { compileComponent, getAssetTag } = require("stylemark")

module.exports = (library, config) => {
    const html = `<!doctype html>
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

A theme has full control over how it compiles and outputs the styleguide. See `src/themes/` for more examples.

Stylemark exposes a number of helpful utilities:

-   `parseComponent`: TBD
-   `compileComponent`: TBD
-   `getMatchingFiles`: TBD
-   `copyMatchingFiles`: TBD
-   `getAssetTag`: TBD
-   `themes`: Set of built-in theme functions, eg. `themes.solo`

And classes used to model data:

-   `Config`
-   `Block`
-   `Component`
-   `Specimen`
-   `Library`

### Custom specimens

TBD
