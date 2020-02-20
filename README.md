# <img src="https://user-images.githubusercontent.com/1235062/63217295-06d97f00-c112-11e9-9082-930885bfffd8.png" width="40" valign="middle"> Stylemark &nbsp; [![npm version](https://badge.fury.io/js/stylemark.svg)](https://badge.fury.io/js/stylemark) [![Build Status](https://travis-ci.org/mpetrovich/stylemark.svg?branch=master)](https://travis-ci.org/mpetrovich/stylemark)

Generate interactive style guides from Markdown.

## Table of contents

- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [Documenting components](#documenting-components)

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

```sh
npx stylemark <config_path>
```

## Configuration

Stylemark can be configured with a JS or JSON file.

```js
module.exports = {
    // [REQUIRED] Input path (string) or paths (array). Paths will be resolved relative to this config file. Globs are supported. This value will be passed directly to globby as the `patterns` parameter: https://github.com/sindresorhus/globby/blob/v11.0.0/readme.md
    input: "src/**/*.{jsx,css}",

    // [REQUIRED] Output directory path, relative to this config file. This directory and any intermediate directories will be automatically created if they don't exist.
    output: "styleguide/",

    // [REQUIRED] Display name of the generated styleguide.
    title: "ACME Styleguide",
}
```

## Documenting components

Components are documented using markdown in code comments or in separate markdown files.

#### In a source code comment

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
*/
export default ({ variant, children }) => {
    return <button className={`button ${variant}`}>{children}</button>
}
````

#### In a markdown file

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
````
