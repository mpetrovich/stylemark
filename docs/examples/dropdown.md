---
name: Dropdown
category: Form
---

This is a dropdown component.

## Basic dropdown

```basic-dropdown.html
<select name="dropdown">
	<option>Select</option>
	<option>Option A</option>
	<option>Option B</option>
	<option>Option C</option>
</select>
```

```basic-dropdown.css
select {
	font-size: 1.5em;
}
```

```basic-dropdown.js
import { onChange } from './utils'
onChange('select', value => `You selected: ${value}`)
```

## Fancy dropdown

```fancy-dropdown.html
<select name="dropdown">
	<option>Select</option>
	<option>Option A</option>
	<option>Option B</option>
	<option>Option C</option>
</select>
```

```fancy-dropdown.css
select {
	font-size: 1.5em;
	background-color: red;
}
```

```fancy-dropdown.js
import { onChange } from './utils'
onChange('select', value => `You fancy: ${value}`)
```
