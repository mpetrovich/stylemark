---
name: Button
category: Form
---

This is a button component.

## Basic button

```basic.html
<button>Click me</button>
```

```basic.css
button {
	color: white;
	background-color: green;
}
```

```basic.js
document
	.querySelector('button')
	.addEventListener('click', function() {
		alert('Clicked!');
	});
```

## Fancy button

```fancy.html
<button>Fancy button</button>
```

```fancy.css
button {
	color: white;
	background-color: red;
}
```

```fancy.js
document
	.querySelector('button')
	.addEventListener('click', function() {
		alert('Fancy click!');
	});
```
