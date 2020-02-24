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

Install the appropriate addons if your components use any of these UI frameworks:

```sh
npm install stylemark-react
npm install stylemark-vue
npm install stylemark-angular
npm install stylemark-ember
```

## Usage

### Command-line

```sh
npx stylemark <config_path>
```

`<config_path>` can refer to a JS or JSON file.

### Node.js

```js
const stylemark = require("stylemark")

stylemark(config)
```

`config` is a configuration object as described below.

## Configuration

Stylemark can be configured with a JS or JSON file.

Example `stylemark.config.json`:

```json
{
    // [REQUIRED] One or more input path globs. Paths are relative to the config file if present or current working directory otherwise. For globbing patterns, see: https://github.com/sindresorhus/globby/blob/v11.0.0/readme.md#globbing-patterns
    "input": ["src/**/*.{jsx,css}", "!*.test.js"],

    // [REQUIRED] Output directory path. Paths is relative to the config file if present or current working directory otherwise. Directories will be automatically created if they don't exist.
    "output": "styleguide/",

    // [REQUIRED] Display name of the generated styleguide.
    "name": "ACME Styleguide"
}
```

Example `stylemark.config.js`:

```js
module.exports = {
    input: ["src/**/*.{jsx,css}", "!*.test.js"],
    output: "styleguide/",
    title: "ACME Styleguide",
}
```

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
