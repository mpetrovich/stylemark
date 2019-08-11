---
name: Button
category: Form
---

This is a button component.

## Basic button

```basic-button.html
<button>Click me</button>
```

```basic-button.css
button {
	color: white;
	background-color: green;
}
```

```basic-button.js
import { onClick } from './utils'
onClick('button', 'Clicked!')
```

## Fancy button

```fancy-button.html
<button>Fancy button</button>
```

```fancy-button.css
button {
	color: white;
	background-color: red;
}
```

```fancy-button.js
import { onClick } from './utils'
onClick('button', 'Fancy click!')
```
