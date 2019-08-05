---
name: Dropdown
category: Form
---

This is a dropdown component.

## Basic dropdown

```basic.html
<select name="dropdown">
	<option>Select</option>
	<option>Option A</option>
	<option>Option B</option>
	<option>Option C</option>
</select>
```

```basic.css
select {
	font-size: 1.5em;
}
```

```basic.js
document
	.querySelector('[name="dropdown"]')
	.addEventListener('change', function(event) {
		alert('You selected: ' + event.target.value);
	});
```

## Fancy dropdown

```fancy.html
<select name="dropdown">
	<option>Select</option>
	<option>Option A</option>
	<option>Option B</option>
	<option>Option C</option>
</select>
```

```fancy.css
select {
	font-size: 1.5em;
	background-color: red;
}
```

```fancy.js
document
	.querySelector('[name="dropdown"]')
	.addEventListener('change', function(event) {
		alert('You selected: ' + event.target.value);
	});
```
