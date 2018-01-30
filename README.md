Stylemark &nbsp; [![npm version](https://badge.fury.io/js/stylemark.svg)](https://badge.fury.io/js/stylemark) [![Build Status](https://travis-ci.org/nextbigsoundinc/stylemark.svg?branch=master)](https://travis-ci.org/nextbigsoundinc/stylemark)
===
**A living style guide generator for everything.** CSS, LESS, SASS, JS, React, Angular, Ember&mdash;you name it.

Document your style guide components in code comments or Markdown files, and Stylemark will generate a static HTML site with live, interactive components.

![Bootstrap style guide](https://user-images.githubusercontent.com/1235062/31162551-2d8f6da6-a8ac-11e7-8874-9e8a2c1c6680.png)

### Examples
- [Bootstrap](http://stylemark-bootstrap.surge.sh/)
- [React](http://stylemark-react.surge.sh/)
- [Ember](http://stylemark-ember.surge.sh/)


Installation
---
Requires Node 6.x+ (4.x support coming soon)
```sh
npm install -g stylemark
```

For a native app with built-in auto-updating/hot-reloading, see [Stylemark App](https://github.com/nextbigsoundinc/stylemark-app).


Documenting style guide components
---
Documenting style guide components is as easy as writing Markdown. Components can be documented in dedicated Markdown files or as comment blocks within any source code. [**See the full Stylemark spec**](README-SPEC.md).

### As a dedicated Markdown file
~~~markdown
---
name: Button
category: Components
---

Buttons can be used with `<a>`, `<button>`, and `<input>` elements.

Types of buttons:
- Default: Standard button
- Primary: Provides extra visual weight and identifies the primary action in a set of buttons
- Success: Indicates a successful or positive action

```types.html
<button class="btn btn-default">Default</button>
<button class="btn btn-primary">Primary</button>
<button class="btn btn-success">Success</button>
```
~~~

### As a comment block within source code
The language of your source code doesn't matter as long as the docs are in `/* … */` comments.
~~~css
/*
---
name: Button
category: Components
---

Buttons can be used with `<a>`, `<button>`, and `<input>` elements.

Types of buttons:
- Default: Standard button
- Primary: Provides extra visual weight and identifies the primary action in a set of buttons
- Success: Indicates a successful or positive action

```types.html
<button class="btn btn-default">Default</button>
<button class="btn btn-primary">Primary</button>
<button class="btn btn-success">Success</button>
```
*/
.btn {
    display: inline-block;
    text-align: center;
    vertical-align: middle;
    …
}
.btn-default {
    …
}
~~~


Generating the HTML style guide
---

### In Node.js
```js
stylemark({ input, output, configPath });
```

Name | Type | Description
--- | --- | ---
`input` | string | Directory where to read from
`output` | string | Directory where to save the generated HTML
`configPath` | string | (optional) Filepath of the stylemark YAML configuration file, defaults to `.stylemark.yml` within the input directory. See [Configuration](#configuration-file)

Example:
```js
stylemark({
	input: '~/git/acme-source-code',
	output: '~/acme-style-guide',
	configPath: '~/acme-source-code/config/stylemark.yml',
});
```


### On the command-line
```sh
stylemark -i <input> -o <output> -c <configPath> -w [<delay>] -b [<port>]
```

Name | Description
---  | ---
`-i` | Directory where to read from
`-o` | Directory where to save the generated HTML
`-c` | (optional) Filepath of the stylemark YAML configuration file, defaults to `.stylemark.yml` within the input directory. See [Configuration](#configuration-file)
`-w` | (optional) Will watch for file changes in `<input>` and rebuild the style guide, waiting at least `<delay>` milliseconds between successive changes (defaults to `2000`)
`-b` | (optional) Will open the style guide in your default browser at `http://localhost:<port>` and will automatically reload it when the style guide is updated. The port will be chosen automatically if not provided.

**Example:** Build a style guide from `path/to/source/code` with a custom config file location, and save the generated HTML to `path/to/style/guide`
```sh
stylemark -i path/to/source/code -o path/to/style/guide -c ~/acme-source-code/config/stylemark.yml
```

**Example:** Build and open the style guide in a browser, and automatically rebuild and reload it when the source code is modified
```sh
stylemark -i path/to/source/code -o path/to/style/guide -w -b
```


### Configuration file
The Stylemark configuration file is a [YAML](https://en.wikipedia.org/wiki/YAML) file that contains settings to use when generating the HTML style guide:
```yaml
name: Name of the style guide
logo: (optional) Relative filepath or absolute URL of your logo
assets: (optional) List of relative file/directory paths to copy and mirror in the generated style guide

excludeDir: (optional) Regex pattern (in double quotes) or list of directories to exclude; .git and node_modules are always excluded
match: (optional) Regex pattern or list of files to process; by default, common source files are included

sidebar:
  background: (optional) Background color of the sidebar; hex colors should be quoted
  textColor: (optional) Text color of the sidebar; hex colors should be quoted

doctypeTag: (optional) For example iframes, the HTML doctype to use; defaults to "<!doctype html>"
headHtml: (optional) For example iframes, HTML to insert before the closing </head> tag
bodyHtml: (optional) For example iframes, HTML to insert before the closing </body> tag

webpackAppPath: For React apps, this is the `output.library` value in your webpack config
emberAppName: For Ember apps, this is the name of the Ember app exported to the window object

order: (optional) See below
```

##### Category order
The relative order of categories can be defined by prefixing a category name with `+`, `-`, or nothing:
- Categories prefixed with `+` will be listed first
- Categories prefixed with `-` will be listed last
- Unprefixed categories will be listed in between

Omitted categories are ordered as if they were included but unprefixed.

Within each of the `+`-, `-`-, and un-prefixed groups, the specified order will be preserved. Example:
```
order:
  - +Getting Started
  - +Overview
  - +Grid
  - Topography
  - -Extras
  - -Other
```

##### Example
Here's an example for [Bootstrap](https://github.com/mpetrovich/bootstrap/):
```yaml
name: Bootstrap
logo: docs/assets/brand/bootstrap-solid.svg

excludeDir:
  - dist
  - docs

assets:
  - dist
  - fonts

sidebar:
  background: "#3b2a55"
  textColor: "#fff"

headHtml: |
  <link rel="stylesheet" href="dist/css/bootstrap.min.css">

bodyHtml: |
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
  <script src="dist/js/bootstrap.min.js"></script>

order:
  - +Getting Started
```
