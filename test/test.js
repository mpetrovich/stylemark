'use strict';

var rfr = require('rfr');
var path = require('path');
var expect = require('chai').expect;
var parser = rfr('src/parser');
var fs = require('fs');
var _ = require('lodash');

describe('A Markdown file without front matter', () => {
	var filepath = 'test/input-without-front-matter.md';
	var content = fs.readFileSync(filepath, 'utf8');
	var language = path.extname(filepath).substr(1);
	var components = parser.parse(content, language, filepath);

	it('should not be processed', () => expect(components.length).to.equal(0));
});

describe('A Markdown file', () => {
	var filepath = 'test/input.md';
	var content = fs.readFileSync(filepath, 'utf8');
	var language = path.extname(filepath).substr(1);
	var components = parser.parse(content, language, filepath);
	var component = components[0];

	it('should have a single component', () => expect(components.length).to.equal(1));
	it('should have the correct component name', () => expect(component.getName()).to.equal('Button'));
	it('should have the correct component category', () => expect(component.getCategory()).to.equal('Components'));
	it('should have the correct component meta', () => expect(component.getMeta()).to.deep.equal({
		tags: ['element', 'interactive', 'form'],
		version: '1.0.3',
		todos: ['fix padding', 'improve colors'],
	}));
	it('should have the correct component description', () => expect(component.getDescription()).to.equal(
		fs.readFileSync('test/expected.md', 'utf8')
	));
	it('should have the correct number of examples', () => expect(_.size(component.getExamples())).to.equal(6));

	it('should have the correct 1st example', () => expect(component.getExamples().types).to.deep.equal({
		name: "types",
		blocks: [
			{
				language: 'html',
				hidden: false,
				content: `<button class="btn btn-default">Default</button>
<button class="btn btn-primary">Primary</button>
<button class="btn btn-success">Success</button>`
			},
			{
				language: 'css',
				hidden: true,
				content: `button { margin: 5px; }`
			},
			{
				language: 'js',
				hidden: true,
				content: `$('button').click(function() { alert('Button clicked!'); });`
			},
		],
		options: {},
	}));

	it('should have the correct 2nd example', () => expect(component.getExamples().sizes).to.deep.equal({
		name: "sizes",
		blocks: [
			{
				language: 'html',
				hidden: true,
				content: `<button class="btn btn-default btn-sm">Small</button>
<button class="btn btn-default">Default</button>
<button class="btn btn-default btn-lg">Large</button>`
			},
		],
		options: {
			height: '100',
		},
	}));

	it('should have the correct 3rd example', () => expect(component.getExamples()['handlebars-button']).to.deep.equal({
		name: "handlebars-button",
		blocks: [
			{
				language: 'handlebars',
				hidden: false,
				content: `{{#bs-button}}Button{{/bs-button}}`
			},
		],
		options: {},
	}));

	it('should have the correct 4rd example', () => expect(component.getExamples()['react-button']).to.deep.equal({
		name: "react-button",
		blocks: [
			{
				language: 'jsx',
				hidden: false,
				content: `<Button>Button</Button>`
			},
		],
		options: {},
	}));

	it('should have the correct 5rd example', () => expect(component.getExamples()['angular-button']).to.deep.equal({
		name: "angular-button",
		blocks: [
			{
				language: 'html',
				hidden: false,
				content: `<button class="btn btn-default">{{ text }}</button>`
			},
			{
				language: 'angularjs',
				hidden: false,
				content: `text = 'Button'`
			},
		],
		options: {},
	}));

	it('should have the correct 6rd example', () => expect(component.getExamples()['disabled']).to.deep.equal({
		name: "disabled",
		blocks: [
			{
				language: 'html',
				hidden: false,
				content: `<button class="btn btn-primary" disabled>Disabled button</button>`
			},
		],
		options: {},
	}));
});

describe('A processed source code file', () => {
	var filepath = 'test/input.css';
	var content = fs.readFileSync(filepath, 'utf8');
	var language = path.extname(filepath).substr(1);
	var components = parser.parse(content, language, filepath);

	it('should have the correct number of components', () => expect(components.length).to.equal(2));

	describe('first component', () => {
		it('should have the correct component name', () => expect(components[0].getName()).to.equal('Button'));
		it('should have the correct component category', () => expect(components[0].getCategory()).to.equal('Components'));
		it('should have the correct component meta', () => expect(components[0].getMeta()).to.deep.equal({
			tags: ['element', 'interactive', 'form'],
			version: '1.0.3',
			todos: ['fix padding', 'improve colors'],
			author: 'nextbigsoundinc',
		}));
		it('should have the correct component description', () => expect(components[0].getDescription()).to.equal(
			fs.readFileSync('test/expected.md', 'utf8')
		));
		it('should have the correct number of examples', () => expect(_.size(components[0].getExamples())).to.equal(6));

		it('should have the correct 1st example', () => expect(components[0].getExamples().types).to.deep.equal({
			name: "types",
			blocks: [
				{
					language: 'html',
					hidden: false,
					content: `<button class="btn btn-default">Default</button>
<button class="btn btn-primary">Primary</button>
<button class="btn btn-success">Success</button>`
				},
				{
					language: 'css',
					hidden: true,
					content: `button { margin: 5px; }`
				},
				{
					language: 'js',
					hidden: true,
					content: `$('button').click(function() { alert('Button clicked!'); });`
				},
			],
			options: {},
		}));
		it('should have the correct 2nd example', () => expect(components[0].getExamples().sizes).to.deep.equal({
			name: "sizes",
			blocks: [
				{
					language: 'html',
					hidden: true,
					content: `<button class="btn btn-default btn-sm">Small</button>
<button class="btn btn-default">Default</button>
<button class="btn btn-default btn-lg">Large</button>`
				},
			],
			options: {
				height: '100',
			},
		}));

		it('should have the correct 3rd example', () => expect(components[0].getExamples()['handlebars-button']).to.deep.equal({
			name: "handlebars-button",
			blocks: [
				{
					language: 'handlebars',
					hidden: false,
					content: `{{#bs-button}}Button{{/bs-button}}`
				},
			],
			options: {},
		}));

		it('should have the correct 4rd example', () => expect(components[0].getExamples()['react-button']).to.deep.equal({
			name: "react-button",
			blocks: [
				{
					language: 'jsx',
					hidden: false,
					content: `<Button>Button</Button>`
				},
			],
			options: {},
		}));

		it('should have the correct 5rd example', () => expect(components[0].getExamples()['angular-button']).to.deep.equal({
			name: "angular-button",
			blocks: [
				{
					language: 'html',
					hidden: false,
					content: `<button class="btn btn-default">{{ text }}</button>`
				},
				{
					language: 'angularjs',
					hidden: false,
					content: `text = 'Button'`
				},
			],
			options: {},
		}));

		it('should have the correct 6rd example', () => expect(components[0].getExamples()['disabled']).to.deep.equal({
			name: "disabled",
			blocks: [
				{
					language: 'html',
					hidden: false,
					content: `<button class="btn btn-primary" disabled>Disabled button</button>`
				},
			],
			options: {},
		}));
	});

	describe('second component', () => {
		it('should have the correct component name', () => expect(components[1].getName()).to.equal('Link'));
		it('should have the correct component category', () => expect(components[1].getCategory()).to.equal('Text'));
		it('should have the correct component meta', () => expect(components[1].getMeta()).to.deep.equal({}));
		it('should have the correct component description', () => expect(components[1].getDescription()).to.equal(
			fs.readFileSync('test/expected-2.md', 'utf8')
		));
		it('should have the correct number of examples', () => expect(_.size(components[1].getExamples())).to.equal(1));

		it('should have the correct 1st example', () => expect(components[1].getExamples().link).to.deep.equal({
			name: "link",
			blocks: [
				{
					language: 'html',
					hidden: false,
					content: `<a href="#" class="text-link">Click me</a>`
				},
			],
			options: {},
		}));
	});
});

describe('A processed source code file with external source examples', () => {
	var expectedOutputFilepath = 'test/external-sources-examples-expected-output.txt';
	var expectedOutput = fs.readFileSync(expectedOutputFilepath, 'utf8');
	var filepath = 'test/external-sources-examples.js';
	var content = fs.readFileSync(filepath, 'utf8');
	var language = path.extname(filepath).substr(1);
	var components = parser.parse(content, language, filepath);

	it('should have the correct number of components', () => expect(components.length).to.equal(1));

	describe('component', () => {
		it('should have the correct number of examples', () => expect(_.size(components[0].getExamples())).to.equal(6));

		it('should have the correct 1st example', () => expect(components[0].getExamples()['single-source-relative']).to.deep.equal({
			name: 'single-source-relative',
			blocks: [
				{
					language: 'html',
					hidden: false,
					content: `<div id="data">External Example Template</div>\n`
				},
			],
			options: {},
		}));

		it('should have the correct 2nd example', () => expect(components[0].getExamples()['single-source-absolute']).to.deep.equal({
			name: 'single-source-absolute',
			blocks: [
				{
					language: 'html',
					hidden: false,
					content: `<div id="data">External Example Template</div>\n`
				},
			],
			options: {},
		}));

		it('should have the correct 3rd example', () => expect(components[0].getExamples()['mixed-sources']).to.deep.equal({
			name: 'mixed-sources',
			blocks: [
				{
					language: 'html',
					hidden: false,
					content: `<div id="data">External Example Template</div>\n`
				},
				{
					language: 'js',
					hidden: false,
					content: `var data2 = {};`
				},
			],
			options: {},
		}));

		it('should have the correct 4th example', () => expect(components[0].getExamples()['multiple-sources']).to.deep.equal({
			name: 'multiple-sources',
			blocks: [
				{
					language: 'html',
					hidden: false,
					content: `<div id="data">External Example Template</div>\n`
				},
				{
					language: 'js',
					hidden: false,
					content: `var data = {};\n`
				},
			],
			options: {},
		}));

		it('should have the correct 5th example', () => expect(components[0].getExamples()['multiple-sources-wildcard']).to.deep.equal({
			name: 'multiple-sources-wildcard',
			blocks: [
				{
					language: 'js',
					hidden: false,
					content: `var data = {};\n`
				},
				{
					language: 'html',
					hidden: false,
					content: `<div id="data">External Example Template</div>\n`
				},
			],
			options: {},
		}));

		it('should have the correct 6th example', () => expect(components[0].getExamples()['hidden-sources']).to.deep.equal({
			name: 'hidden-sources',
			blocks: [
				{
					language: 'js',
					hidden: true,
					content: `var data = {};\n`
				},
				{
					language: 'html',
					hidden: false,
					content: `<div id="data-2">Inline Source Template</div>`
				},
			],
			options: {},
		}));

		it('should have replaced the external source references in the description', () => expect(components[0].getDescription()).to.equal(
			expectedOutput
		));
	});
});
