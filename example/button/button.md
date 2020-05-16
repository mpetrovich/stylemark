---
name: Button
---

## Dynamic button

```dynamic.html
<button>Button</button>
```

```dynamic.html
<label class="label">Button text:</label>
<input type="text">
```

```dynamic.css
::slotted(.label) { color: red !important; }
```

```dynamic.js
const button = document.querySelector("button")
const input = document.querySelector("input")
input.value = button.innerText = "Button"
input.addEventListener("keydown", event => button.innerText = event.target.value)
```

## Button types

```types.html
<button id="a" class="primary">Primary</button>
<button class="success">Success</button>
<button class="danger">Danger</button>
```

```types.css
::slotted(div) {
    padding: 10px;
    background: green;
}
::slotted(button) {
    background: #ccf;
}
```

```types.js
document.querySelector("button").innerText = "foo"
document.querySelectorAll("button").forEach((el) =>
    el.addEventListener("click", (event) => console.log(`Inline ${event.target.innerText}`)))
console.log("inline js")
```

## Button sizes

```sizes.html
<button id="b" class="l">Large</button>
<button class="m">Medium</button>
<button class="s">Small</button>
```

```sizes.js
document.querySelectorAll("button").forEach((el) =>
    el.addEventListener("click", (event) => console.log(`Inline ${event.target.innerText}`)))
```
