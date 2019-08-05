---
name: Example Component
category: Other
---

This is an example component with specimens.

## Button

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

## Dropdown

```dropdown.html
<select name="dropdown">
	<option>Select</option>
	<option>Option A</option>
	<option>Option B</option>
	<option>Option C</option>
</select>
```

```dropdown.css
select {
	font-size: 1.5em;
}
```

```dropdown.js
document
	.querySelector('[name="dropdown"]')
	.addEventListener('change', function(event) {
		alert('You selected: ' + event.target.value);
	});
```
