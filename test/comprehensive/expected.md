Inspired by the excellent jQuery.tipsy plugin written by Jason Frame; Tooltips are an updated version, which don't rely on images, use CSS3 for animations, and data-attributes for local title storage.

Tooltips with zero-length titles are never displayed.

Examples
--------
Hover over the links below to see tooltips:

<example name="example"></example>

### Static tooltip
Four options are available: top, right, bottom, and left aligned.

<example name="static" height="50"></example>

### Four directions

<example name="static-directions"></example>
```html
<button type="button" class="btn btn-default" data-toggle="tooltip" data-placement="left" title="Tooltip on left">Tooltip on left</button>

<button type="button" class="btn btn-default" data-toggle="tooltip" data-placement="top" title="Tooltip on top">Tooltip on top</button>

<button type="button" class="btn btn-default" data-toggle="tooltip" data-placement="bottom" title="Tooltip on bottom">Tooltip on bottom</button>

<button type="button" class="btn btn-default" data-toggle="tooltip" data-placement="right" title="Tooltip on right">Tooltip on right</button>
```

#### Opt-in functionality
For performance reasons, the Tooltip and Popover data-apis are opt-in, meaning you must initialize them yourself.

One way to initialize all tooltips on a page would be to select them by their data-toggle attribute:
```js
$(function () {
  $('[data-toggle="tooltip"]').tooltip()
})
```

Usage
-----
The tooltip plugin generates content and markup on demand, and by default places tooltips after their trigger element.

Trigger the tooltip via JavaScript:
``` js
$('#example').tooltip(options)
```

Markup
------
The required markup for a tooltip is only a `data` attribute and `title` on the HTML element you wish to have a tooltip. The generated markup of a tooltip is rather simple, though it does require a position (by default, set to `top` by the plugin).

```html
<!-- HTML to write -->
<a href="#" data-toggle="tooltip" title="Some tooltip text!">Hover over me</a>

<!-- Generated markup by the plugin -->
<div class="tooltip top" role="tooltip">
  <div class="tooltip-arrow"></div>
  <div class="tooltip-inner">
    Some tooltip text!
  </div>
</div>
```

Interactive example
-------------------

<example name="interactive"></example>
```html
<button>Click me</button>
```