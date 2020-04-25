# Stylemark &nbsp; [![npm version](https://badge.fury.io/js/stylemark.svg)](https://badge.fury.io/js/stylemark) [![Build Status](https://travis-ci.org/mpetrovich/stylemark.svg?branch=master)](https://travis-ci.org/mpetrovich/stylemark)

Generate interactive style guides from Markdown.

## Table of contents

-   [Installation](#installation)
-   [Usage](#usage)
-   [Configuration](#configuration)
-   [Documenting components](#documenting-components)

## Installation

Stylemark requires Node.js v8+

```sh
npm install stylemark
```

## Usage

### On the command line

```sh
npx stylemark <config filepath> [-w|--watch]
```

| Parameter       | Description                                       |
| --------------- | ------------------------------------------------- |
| `<config>`      | JS or JSON file containing a configuration object |
| `-w`, `--watch` | Launches a hot-reloading styleguide in a browser  |

### In Node.js

```js
const stylemark = require("stylemark")

stylemark({
    /* see configuration below */
})
```

## Configuration

| Property | Type                       | Default               | Description                                                                                                                             |
| -------- | -------------------------- | --------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `input`  | string or array of strings |                       | Input path globs. See [Globbing patterns](#globbing-patterns).                                                                          |
| `output` | string                     |                       | Output directory path. Directories will be automatically created if they don't exist.                                                   |
| `cwd`    | string                     | Config file directory | Base path that `input` and `output` paths are relative to. When using the command line, paths are resolved relative to the config file. |
| `name`   | string                     | `Stylemark`           | Display name of the generated styleguide.                                                                                               |

Example:

```js
{
    input: ["src/**/*.{js,md}", "!*.test.js"],
    output: "dist/styleguide",
    name: "ACME Styleguide",
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
