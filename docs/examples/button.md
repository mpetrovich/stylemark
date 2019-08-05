---
name: Button
category: Form
---

This is a button component.

## Basic button

```button.html
<button>Click me</button>
```

```button.css
button {
	color: white;
	background-color: green;
}
```

```button.js
document
	.querySelector('button')
	.addEventListener('click', function() {
		alert('Clicked!');
	});
```

## Fancy button

```button.html
<button>Click me</button>
```

```button.css
button {
	color: white;
	background-color: red;
}
```

```button.js
document
	.querySelector('button')
	.addEventListener('click', function() {
		alert('Fancy click!');
	});
```
