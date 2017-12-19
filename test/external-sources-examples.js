/*
---
name: External Sources Examples
category: Tests
---

Single Source
-------------
An example can reference a single external source with an absolute path or a relative path:

```single-source-relative:external_examples/external-template.html
```

Mixed with Inline Sources
----------------------------
An example can combine external sources with inline sources:

```mixed-sources:external_examples/external-template.html
```
```mixed-sources.js
var data2 = {};
```

Multiple Sources
----------------
An example can reference multiple sources individually:

```multiple-sources:external_examples/external-template.html
```
```multiple-sources:external_examples/external-data.js
```

or with a wildcard:

```multiple-sources-wildcard:external_examples/*
```

Hidden Sources
--------------
An external source can also be hidden:

```hidden-sources:external_examples/external-data.js hidden
```
```hidden-sources.html
<div id="data-2">Inline Source Template</div>
```

*/

var exampleFunction = function() {
    console.log('This is an example function');
};
