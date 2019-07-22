---
name: Component Name
category: Component Category
---

Specimen with `hidden` prop:

```specimen-1.html
<b>Specimen 1</b>
```

```specimen-1.css hidden
b { color: red }
```

```specimen-1.js nothidden
var foo = 'not hidden'
```

```specimen-1.js hidden
---
hidden: false
---
var bar = 'hidden'
```

Specimen with frontmatter props:

```specimen-2.html
---
hidden: true
key: value
---
<b>Specimen 2</b>
```

```specimen-2.css ignored hidden ignored
---
key: value
list:
- one
- two
- three
---
b { color: green }
```
