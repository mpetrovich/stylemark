StyleGuideDoc &nbsp; [![Build Status](https://travis-ci.org/LivingStyleGuides/StyleGuideDoc.svg?branch=master)](https://travis-ci.org/LivingStyleGuides/StyleGuideDoc)
=============
StyleGuideDoc is a standard for documenting [living style guides](https://www.google.com/search?q=what+is+a+living+style+guide) like [these](http://styleguides.io/examples.html).



Syntax
------
Documenting style guide components is as easy as writing Markdown. Components can be documented in dedicated Markdown files:

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

…or as comment blocks within any source code:

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

In both cases, the output will be the same.

For more details and examples, see the full [StyleGuideDoc spec](doc/spec.md).



Installation
------------
Available on [npm](https://www.npmjs.com/package/styleguidedoc):
```sh
npm install styleguidedoc
# or
yarn add styleguidedoc
```



Usage
-----
```js
docs = styleguidedoc.parse(content, syntax)
```

Name | Type | Description
--- | --- | ---
`content` | string | File content
`syntax` | string | File extension

Returns a list of docs extracted from `content`.

#### Example
_Extracts components from a CSS file._

```js
var fs = require('fs');
var styleguidedoc = require('styleguidedoc');

var content = fs.readFileSync('button.css', 'utf8');
var syntax = 'md';
var docs = styleguidedoc.parse(content, syntax);

console.log(JSON.stringify(docs));
```
Outputs:
```json
[
  {
    "name": "Button",
    "category": "Components",
    "description": "Buttons can be used with `<a>`, `<button>`, and `<input>` elements.\n\nTypes of buttons:\n- Default: Standard button\n- Primary: Provides extra visual weight and identifies the primary action in a set of buttons\n- Success: Indicates a successful or positive action\n\n<example name=\"types\"></example>\n```html\n<button class=\"btn btn-default\">Default</button>\n<button class=\"btn btn-primary\">Primary</button>\n<button class=\"btn btn-success\">Success</button>\n```",
    "examples": {
      "types": {
        "codeBlocks": [
          {
            "syntax": "html",
            "code": "<button class=\"btn btn-default\">Default</button>\n<button class=\"btn btn-primary\">Primary</button>\n<button class=\"btn btn-success\">Success</button>",
            "hidden": false
          }
        ],
        "options": {}
      }
    }
  }
]
```
