---
name: Button
---

## Button types

```types.html
<button id="a" class="primary">Primary</button>
<button class="success">Success</button>
<button class="danger">Danger</button>
```

```types.css
div {
    padding: 10px;
    background: green;
}
button {
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
