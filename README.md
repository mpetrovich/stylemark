Stylemark &nbsp; [![npm version](https://badge.fury.io/js/stylemark.svg)](https://badge.fury.io/js/stylemark) [![Build Status](https://travis-ci.org/LivingStyleGuides/Stylemark.svg?branch=master)](https://travis-ci.org/LivingStyleGuides/stylemark)
===
A living style guide generator.

Document your style guide components in code comments or Markdown files, and Stylemark will generate a static HTML site with live, interactive components. [**See an example**](https://stylemark.github.io).

![Bootstrap style guide](https://user-images.githubusercontent.com/1235062/29730805-d8150cb6-89af-11e7-8ded-5d4810cab462.png)


Installation
---
Requires Node 6.x+ (4.x support coming soon)
```sh
npm install stylemark
```


Documenting style guide components
---
Documenting style guide components is as easy as writing Markdown. Components can be documented in dedicated Markdown files or as comment blocks within any source code. [**See the full Stylemark spec**](doc/spec.md).

#### As a dedicated Markdown file
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

#### As a comment block within source code
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

#### In Node.js
```js
stylemark({ input, output, configPath });
```

Name | Type | Description
--- | --- | ---
`input` | string | Directory where to read from
`output` | string | Directory where to save the generated HTML
`configPath` | string | (optional) Filepath of the stylemark YAML configuration file, defaults to `.stylemark.yml` within the input directory

Example:
```js
stylemark({
	input: '~/git/acme-source-code',
	output: '~/acme-style-guide',
	configPath: '~/acme-source-code/config/stylemark.yml',
});
```


#### On the command-line
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
`-c` | (optional) Filepath of the stylemark YAML configuration file, defaults to `.stylemark.yml` within the input directory
