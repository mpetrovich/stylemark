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


External example files
---
Additionally, you can reference code written in external files, using the following syntax:


~~~markdown
```<name>:<path>
```
~~~
where:

`<name>` is the example name (without file extension)

`<path>` is the filepath, by default relative to the current file. If prefixed with `/`, then the
path will be relative to the directory that `stylemark` is executed in (which would normally be
root of your project).

#### Example
This first example uses a 'data' object from a shared JS file:
~~~markdown
```example-1.js
console.log('Example 1: ' + data);
```
```example-1:/path/to/data/data.js
```
~~~

This second example uses the same shared JS file:
~~~markdown
```example-2.js
console.log('Example 2: ' + data);
```
```example-2:/path/to/data/data.js
```
~~~
Where `/path/to/data/data.js` contains:

```
data = { … }
```

#### Wildcards
Given the following files:

```
// in /path/to/data/data.js:
data = { … }

// in /path/to/somewhere/foo.html:
Data: <div id="data"></div>

// in /path/to/somewhere/bar.js:
document.getElementById('data').innerHTML = JSON.stringify(data);
```
you could write:

~~~markdown
```example-3:/path/to/data/data.js
```
```example-3:/path/to/somewhere/*
```
~~~
which would be equivalent to this inline version:

~~~markdown
```example-3.js
data = { … }
```
```example-3.html
Data: <div id="data"></div>
```
```example-3.js
document.getElementById('data').innerHTML = JSON.stringify(data);
```
~~~
