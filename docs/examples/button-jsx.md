---
name: Button
category: Form
---

This is a button component.

## Basic button

```basic-button.jsx
<Button className="danger">React button</Button>
```

```basic-button.css
button {
	color: white;
	background-color: green;
}
button.danger {
    background-color: red;
}
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
$0.querySelector("button").addEventListener("click", e => alert("Clicked fancy button"))
```
