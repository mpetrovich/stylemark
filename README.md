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

### Command-line interface (CLI)

```sh
npx stylemark <config> [-w|--watch]
```

| Parameter       | Description                                                                                                |
| --------------- | ---------------------------------------------------------------------------------------------------------- |
| `<config>`      | JS or JSON file containing a configuration object                                                          |
| `-w`, `--watch` | Opens the generated styleguide in a browser and reloads when any matching input files are added or changed |

### Node.js API

```js
const stylemark = require("stylemark")

stylemark(config)
```

## Configuration

| Property | Type                       | Default                                                | Description                                                                           |
| -------- | -------------------------- | ------------------------------------------------------ | ------------------------------------------------------------------------------------- |
| `input`  | string or array of strings |                                                        | Input path globs. See [Globbing patterns](#globbing-patterns).                        |
| `output` | string                     |                                                        | Output directory path. Directories will be automatically created if they don't exist. |
| `cwd`    | string                     | CLI: config file directory<br>Node.js: `process.cwd()` | Base path that `input` and `output` paths are relative to.                            |
| `name`   | string                     | `Stylemark`                                            | Display name of the generated styleguide.                                             |

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

## Specimens

A specimen is an interactive example made up of one or more named Markdown code blocks.

````md
```form.html
<form>
    <input name="email" type="email" placeholder="name@example.com">
    <input name="password" type="password">
    <button type="submit">Log in</button>
</form>
```

```form.css
input, button { display: block }
```

```form.js
document.querySelector('form').addEventListener('submit', event => {
    event.preventDefault()
    alert('You logged in')
})
```
````

Specimen code blocks are insulated from each other. For instance, CSS styles defined for one specimen will not affect other specimens.
