---
name: Component Name
category: Component Category
---

This is the first specimen:

```specimen-1.html
<b>Specimen 1</b>
```

```specimen-1.css
b { color: red }
```

This is a specimen with nested external imports:

```specimen-2.html
import './with-nested-external-imports.external-import.html'
<b>Specimen 2</b>
```

```specimen-2.js
import './with-nested-external-imports.external-import.js'
import './with-nested-external-imports.external-import-2.js'
var specimen = 2
```

```specimen-2.css
b { color: green }
```
