StyleGuideDoc &nbsp; [![Build Status](https://travis-ci.org/LivingStyleGuides/StyleGuideDoc.svg?branch=master)](https://travis-ci.org/LivingStyleGuides/StyleGuideDoc)
=============
Tools for documenting living style guides.

What's a living style guide?
----------------------------
A style guide documents the components of a design system. A _living_ style guide is one with real examples that stay up-to-date with the underlying source code. Here are [a few examples](http://styleguides.io/examples.html).

Documenting
-----------
Documenting a living style guide is as easy as writing Markdown. StyleGuideDoc uses an enhanced version of [GitHub-flavored Markdown](https://guides.github.com/features/mastering-markdown/).

Here's an example of documentation for button component:

	---
	name: Button
	category: Components
	---

	Buttons can be used with `<a>`, `<button>`, and `<input>` elements.

	Types of buttons:
	- Default: Standard button
	- Primary: Provides extra visual weight and identifies the primary action in a set of buttons
	- Success: Indicates a successful or positive action

	```types.html
	<button class="btn btn-default">Default</button>
	<button class="btn btn-primary">Primary</button>
	<button class="btn btn-success">Success</button>
	```
