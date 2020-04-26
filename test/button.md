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
$document.querySelector("button").addEventListener("click", e => alert("Clicked button"))
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
$document.querySelector("button").addEventListener("click", e => alert("Clicked fancy button"))
```
