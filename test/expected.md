
A button can be used with `<button>` and `<a>` elements.

```html
<a class="btn btn-default" href="#">Button</a>
<button class="btn btn-default">Button</button>
```


Types
-----
Buttons can have several types:

class | description
--- | ---
`btn-default` | Standard button
`btn-primary` | Primary call-to-action
`btn-success` | Indicates a successful or positive action

<example name="types"></example>
```types.html
<button class="btn btn-default">Default</button>
<button class="btn btn-primary">Primary</button>
<button class="btn btn-success">Success</button>
```


Sizes
-----
Buttons have different sizes available:
- `btn-sm`
- `btn-lg`

<example name="sizes" height="100"></example>


Frameworks
----------
Buttons can be used with Handlebars, React/JSX, and AngularJS.

In Handlebars:
<example name="handlebars-button"></example>
```handlebars-button.handlebars
{{#bs-button}}Button{{/bs-button}}
```

In React/JSX:
<example name="react-button"></example>
```react-button.jsx
<Button>Button</Button>
```

In AngularJS:
<example name="angular-button"></example>
```angular-button.html
<button class="btn btn-default">{{ text }}</button>
```
```angular-button.angularjs
text = 'Button'
```


Edge cases
----------
Pipes (`|`) can be escaped in tables:

One | Two | Three
--- | --- | ---
foo | an escaped pipe \| lives here | bar
what | `{{ 'foo' \| bar }}` | who

< and > can also be escaped to prevent them from being treated as HTML tags: \<foo\>


Disabled state
--------------
Buttons can be disabled too.

<example name="disabled"></example>
```disabled.html
<button class="btn btn-primary" disabled>Disabled button</button>
```
