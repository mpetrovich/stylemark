---
name: Component Name
category: Component Category
---

Specimen with `hidden` flags:

```specimen.html
<b>Specimen</b>
```

```specimen.css hidden foo
b { color: red }
```

```specimen.js bar not-hidden
var foo = 'not hidden'
```

```specimen.js foo hidden bar
var bar = 'hidden'
```