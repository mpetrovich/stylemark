# <img src="https://user-images.githubusercontent.com/1235062/63217295-06d97f00-c112-11e9-9082-930885bfffd8.png" width="40" valign="middle"> Stylemark &nbsp; [![npm version](https://badge.fury.io/js/stylemark.svg)](https://badge.fury.io/js/stylemark) [![Build Status](https://travis-ci.org/mpetrovich/stylemark.svg?branch=master)](https://travis-ci.org/mpetrovich/stylemark)

Framework-agnostic living style guide generator.

## Table of contents

1. [Quickstart](#quickstart)
1. [Documenting components](#documenting-components)
1. [Installation](#installation)
1. [Configuration](#configuration)
1. [Usage](#usage)
1. [Customization](#customization)
1. [Extending](#extending)
1. [Contributing](#contributing)

## Quickstart

```sh
npx stylemark <input path> <output path>
```

This command will generate a living style guide in a new `<output path>` directory from documented components in the `<input path>` directory.

By default, files with these extensions will be searched: `.md` `.markdown` `.js` `.jsx` `.ts` `.css` `.scss` `.less`

Example:

```sh
npx stylemark src/ styleguide/
```

## Documenting components

Components are documented using markdown syntax.

#### In a markdown file

`button.md`:

````md
---
name: Button
category: Interactive
---

This is a primary button:

```basic.jsx
<Button variant="primary">Primary</Button>
```

This is a danger button:

```danger.jsx
<Button variant="danger">Danger</Button>
```
````

#### In source code comments

`button.js`:

````js
/*
---
name: Button
category: Interactive
---

This is a primary button:

```basic.jsx
<Button variant="primary">Primary</Button>
```

This is a danger button:

```danger.jsx
<Button variant="danger">Danger</Button>
```
*/
export default ({ variant, children }) => (…)
````

## Installation

Stylemark requires Node.js v8+

```sh
npm install stylemark
```

To support common frameworks, install the following addons:

```sh
npm install stylemark-react
npm install stylemark-vue
npm install stylemark-angular
npm install stylemark-ember
```

## Configuration

Stylemark can be configured in several ways.

## Usage

#### Command line

#### Node.js API

## Customization

## Extending

## Contributing
