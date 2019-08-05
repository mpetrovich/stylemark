---
name: Dropdown
category: Form
---

This is a dropdown component.

## Basic dropdown

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

## Fancy dropdown

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
	background-color: red;
}
```

```dropdown.js
document
	.querySelector('[name="dropdown"]')
	.addEventListener('change', function(event) {
		alert('You selected: ' + event.target.value);
	});
```
