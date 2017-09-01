Stylemark &nbsp; [![npm version](https://badge.fury.io/js/stylemark.svg)](https://badge.fury.io/js/stylemark) [![Build Status](https://travis-ci.org/mpetrovich/Stylemark.svg?branch=master)](https://travis-ci.org/mpetrovich/stylemark)
===
**A living style guide generator for everything.** CSS, LESS, SASS, JS, React, Angular, Ember&mdash;you name it.

Document your style guide components in code comments or Markdown files, and Stylemark will generate a static HTML site with live, interactive components.

### Demo: &nbsp; [Bootstrap](http://stylemark-bootstrap.surge.sh/) &nbsp; [React](http://stylemark-react.surge.sh/) &nbsp; [Ember](http://stylemark-ember.surge.sh/)

![Bootstrap style guide](https://user-images.githubusercontent.com/1235062/29730805-d8150cb6-89af-11e7-8ded-5d4810cab462.png)


Installation
---
Requires Node 6.x+ (4.x support coming soon)
```sh
npm install stylemark
```
To enable command-line usage, use `--link`:
```sh
npm install stylemark --link
```


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
Note: Stylemark must be installed with the `--link` flag to enable CLI usage. See [Installation](#installation) notes.
```sh
bin/stylemark -i <input> -o <output> -c <configPath>
```

Example:
```sh
bin/stylemark -i ~/git/acme-source-code -o ~/acme-style-guide -c ~/acme-source-code/config/stylemark.yml
```

Name | Description
---  | ---
`-i` | Directory where to read from
`-o` | Directory where to save the generated HTML
`-c` | (optional) Filepath of the stylemark YAML configuration file, defaults to `.stylemark.yml` within the input directory. See [Configuration](#configuration-file)


### Configuration file
The Stylemark configuration file is a [YAML](https://en.wikipedia.org/wiki/YAML) file that contains settings to use when generating the HTML style guide:
```yaml
name: name of the style guide
doctypeTag: (optional) For example iframes, the HTML doctype to use; defaults to "<!doctype html>"
headHtml: (optional) For example iframes, HTML to insert before the closing </head> tag
bodyHtml: (optional) For example iframes, HTML to insert before the closing </body> tag
webpackAppPath: For React apps, this is the `output.library` value in your webpack config
emberAppName: For Ember apps, this is the name of the Ember app exported to the window object
```

Here's an example for [React Boostrap](https://github.com/mpetrovich/react-bootstrap/):
```yaml
name: React Bootstrap

headHtml: |
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/latest/css/bootstrap.min.css">
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/latest/css/bootstrap-theme.min.css">
  <script>window._LIBRARY = 'ReactBootstrap';</script>

bodyHtml: |
  <script src="https://cdnjs.cloudflare.com/ajax/libs/react/15.4.2/react.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/react/15.4.2/react-dom.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/react-bootstrap/0.30.8/react-bootstrap.min.js"></script>

webpackAppPath: ReactBootstrap
```
