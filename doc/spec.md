Stylemark Spec
===
Stylemark is an extension of [GitHub-flavored Markdown](https://guides.github.com/features/mastering-markdown/) with executable code blocks.


Executable code blocks
---
A fenced code block with a name will be identified as an executable example. To name a code block, prefix the language string with the name followed by a period, eg. `name.js`. Names can have any characters except whitespace or periods.

#### Example
_This HTML code block defines an example named `button-types` and will be rendered as a real HTML example._

~~~markdown
```button-types.html
<button class="btn btn-default">Default</button>
<button class="btn btn-primary">Primary</button>
<button class="btn btn-success">Success</button>
```
~~~

Executable examples can have more than just HTML. You can include JS, CSS, JSX, Angular, etc. through additional code blocks that share the same name.

#### Example
_These code blocks define a `hello` example with HTML, JS, and CSS. All JS and CSS will be sandboxed to the HTML._

~~~markdown
```hello.html
<button>Say Hello</button>
```
```hello.js
$('button').click(function() { alert('Hello!'); });
```
```hello.css
button {
    background: green;
}
```
~~~

Sometimes it's desirable to execute a code block but hide its source code. Code blocks can be marked as hidden by including a `hidden` option in the fenced code block definition.

#### Example
_The CSS styling will be applied to the button, but the CSS source will not be shown._

~~~markdown
```padded.html
<button>Click me</button>
```
```padded.css hidden
button {
	display: block;
	margin: 20px;
}
```
~~~
