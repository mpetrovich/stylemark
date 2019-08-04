---
name: Example Component
category: Other
---

This is an example component with a single specimen.

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
