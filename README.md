# Stylemark &nbsp; [![npm version](https://badge.fury.io/js/stylemark.svg)](https://badge.fury.io/js/stylemark) [![Build Status](https://travis-ci.org/mpetrovich/stylemark.svg?branch=master)](https://travis-ci.org/mpetrovich/stylemark)

Generate interactive style guides from Markdown.

## Table of contents

-   [Installation](#installation)
-   [Usage](#usage)
-   [Configuration](#configuration)
-   [Documenting components](#documenting-components)

## Installation

Requires Node.js v8+

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
| `<config>`      | JS or JSON configuration filepath                |
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
        String or array of filepath globs.

        Globbing patterns:
          *  matches any number of characters, but not /
          ?  matches a single character, but not /
          ** matches any number of characters, including /, as long as it's the only thing in a path part
          {} allows for a comma-separated list of "or" expressions
          !  at the beginning of a pattern will negate the match
    */
    input: ["src/**/*.{js,md}", "!*.test.js"],

    /*
        Output directory path. Directories will be automatically created if they don't exist.
    */
    output: "dist/styleguide",

    /*
        Base path that input and output paths are relative to. When using Stylemark on the command line, this will be automatically set to the directory containing the config file.
    */
    cwd: "../",

    /*
        Display name of the generated styleguide.
    */
    name: "ACME Styleguide",
}
```

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
