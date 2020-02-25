# Documenting components

## Specimens

A specimen is an interactive example made up of one or more named Markdown code blocks.

````md
```form.html
<form>
    <input name="email" type="email" placeholder="name@example.com">
    <input name="password" type="password">
    <button type="submit">Log in</button>
</form>
```

```form.css
input, button { display: block }
```

```form.js
document.querySelector('form').addEventListener('submit', event => {
    event.preventDefault()
    alert('You logged in')
})
```
````

CSS code blocks are insulated from each other but JavaScript code blocks are NOT.
