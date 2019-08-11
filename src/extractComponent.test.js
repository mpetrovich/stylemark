import test from 'ava'
import { readFileSync } from 'fs'
import path from 'path'
import extractComponent from './extractComponent'

test('No component is extracted from markdown that does not have frontmatter', async t => {
	const markdown = readFileSync(`${__dirname}/extractComponent-test-cases/no-frontmatter.md`, {
		encoding: 'utf8',
	})
	const component = await extractComponent(markdown)

	t.is(component, null)
})

test('No component is extracted from markdown that has frontmatter but no name property', async t => {
	const markdown = readFileSync(`${__dirname}/extractComponent-test-cases/no-frontmatter-name.md`, {
		encoding: 'utf8',
	})
	const component = await extractComponent(markdown)

	t.is(component, null)
})

test('A component is extracted from markdown that has frontmatter with a name property', async t => {
	const markdown = readFileSync(`${__dirname}/extractComponent-test-cases/frontmatter.md`, {
		encoding: 'utf8',
	})
	const component = await extractComponent(markdown)

	t.deepEqual(component, {
		contentHtml: readFileSync(`${__dirname}/extractComponent-test-cases/frontmatter.expected.html`, {
			encoding: 'utf8',
		}),
		name: 'Component Name',
		meta: {
			category: 'Component Category',
		},
		specimens: [],
	})
})

test('Specimens are extracted from named code blocks', async t => {
	const markdown = readFileSync(`${__dirname}/extractComponent-test-cases/specimens.md`, {
		encoding: 'utf8',
	})
	const component = await extractComponent(markdown)

	t.deepEqual(component, {
		contentHtml: readFileSync(`${__dirname}/extractComponent-test-cases/specimens.expected.html`, {
			encoding: 'utf8',
		}),
		name: 'Component Name',
		meta: {
			category: 'Component Category',
		},
		specimens: [
			{
				name: 'specimen-1',
				blocks: [
					{
						language: 'html',
						flags: {},
						props: {},
						displayContent: '<b>Specimen 1</b>',
						executableContent: '<b>Specimen 1</b>',
					},
					{
						language: 'css',
						flags: {},
						props: {},
						displayContent: 'b { color: red }',
						executableContent: 'b { color: red }',
					},
				],
			},
			{
				name: 'specimen-2',
				blocks: [
					{
						language: 'html',
						flags: {},
						props: {},
						displayContent: '<b>Specimen 2</b>',
						executableContent: '<b>Specimen 2</b>',
					},
					{
						language: 'css',
						flags: {},
						props: {},
						displayContent: 'b { color: green }',
						executableContent: 'b { color: green }',
					},
				],
			},
		],
	})
})

test('Specimen blocks can have arbitrary inline flags', async t => {
	const markdown = readFileSync(`${__dirname}/extractComponent-test-cases/specimen-flags.md`, {
		encoding: 'utf8',
	})
	const component = await extractComponent(markdown)

	t.deepEqual(component, {
		contentHtml: readFileSync(`${__dirname}/extractComponent-test-cases/specimen-flags.expected.html`, {
			encoding: 'utf8',
		}),
		name: 'Component Name',
		meta: {
			category: 'Component Category',
		},
		specimens: [
			{
				name: 'specimen',
				blocks: [
					{
						language: 'html',
						flags: {},
						props: {},
						displayContent: '<b>Specimen</b>',
						executableContent: '<b>Specimen</b>',
					},
					{
						language: 'css',
						flags: { hidden: true, foo: true },
						props: {},
						displayContent: 'b { color: red }',
						executableContent: 'b { color: red }',
					},
					{
						language: 'js',
						flags: { bar: true, 'not-hidden': true },
						props: {},
						displayContent: `var foo = 'not hidden'`,
						executableContent: `var foo = 'not hidden'`,
					},
					{
						language: 'js',
						flags: { hidden: true, foo: true, bar: true },
						props: {},
						displayContent: `var bar = 'hidden'`,
						executableContent: `var bar = 'hidden'`,
					},
				],
			},
		],
	})
})

test('Specimen blocks can have arbitrary frontmatter props', async t => {
	const markdown = readFileSync(`${__dirname}/extractComponent-test-cases/specimen-props.md`, {
		encoding: 'utf8',
	})
	const component = await extractComponent(markdown)

	t.deepEqual(component, {
		contentHtml: readFileSync(`${__dirname}/extractComponent-test-cases/specimen-props.expected.html`, {
			encoding: 'utf8',
		}),
		name: 'Component Name',
		meta: {
			category: 'Component Category',
		},
		specimens: [
			{
				name: 'specimen',
				blocks: [
					{
						language: 'html',
						flags: {},
						props: { key: 'value' },
						displayContent: '<b>Specimen</b>',
						executableContent: '<b>Specimen</b>',
					},
					{
						language: 'css',
						flags: { hidden: true },
						props: { key: 'value', list: ['one', 'two', 'three'] },
						displayContent: 'b { color: green }',
						executableContent: 'b { color: green }',
					},
				],
			},
		],
	})
})

test('Imported files in JS specimen blocks are inlined', async t => {
	const markdown = readFileSync(`${__dirname}/extractComponent-test-cases/imports.md`, { encoding: 'utf8' })
	const dirpath = path.resolve(__dirname, 'extractComponent-test-cases/')
	const component = await extractComponent(markdown, { dirpath, webpackMode: 'development' }) // Development mode prevents minification of imports

	const executableContent1 = component.specimens[0].blocks[0].executableContent
	delete component.specimens[0].blocks[0].executableContent

	// Positive tests
	t.assert(
		executableContent1.indexOf(`var externalImport1 = 'one'`) !== -1,
		'Executable content contains inlined import'
	)
	t.assert(executableContent1.indexOf(`var specimen = 1`) !== -1, 'Executable content contains block content')

	// Negative tests
	t.assert(
		executableContent1.indexOf(`var externalImport2 = 'two'`) === -1,
		'Executable content does NOT contain inlined import from a different specimen'
	)
	t.assert(
		executableContent1.indexOf(`var specimen = 2`) === -1,
		'Executable content does NOT contain block content from a different specimen'
	)

	const executableContent2 = component.specimens[1].blocks[0].executableContent
	delete component.specimens[1].blocks[0].executableContent

	// Positive tests
	t.assert(
		executableContent2.indexOf(`var externalImport2 = 'two'`, 'Executable content contains inlined import') !== -1
	)
	t.assert(executableContent2.indexOf(`var specimen = 2`) !== -1, 'Executable content contains block content')

	// Negative tests
	t.assert(
		executableContent2.indexOf(`var externalImport1 = 'one'`) === -1,
		'Executable content does NOT contain inlined import from a different specimen'
	)
	t.assert(
		executableContent2.indexOf(`var specimen = 1`) === -1,
		'Executable content does NOT contain block content from a different specimen'
	)

	t.deepEqual(component, {
		contentHtml: readFileSync(`${__dirname}/extractComponent-test-cases/imports.expected.html`, {
			encoding: 'utf8',
		}),
		name: 'Component Name',
		meta: {
			category: 'Component Category',
		},
		specimens: [
			{
				name: 'specimen-1',
				blocks: [
					{
						language: 'js',
						flags: {},
						props: {},
						displayContent: "import './imports.import-1.js'\nvar specimen = 1",
					},
				],
			},
			{
				name: 'specimen-2',
				blocks: [
					{
						language: 'js',
						flags: {},
						props: {},
						displayContent: "import './imports.import-2.js'\nvar specimen = 2",
					},
				],
			},
		],
	})
})

test.failing('Imported files in CSS specimen blocks are inlined', t => {})
test.failing('Imported files in HTML specimen blocks are inlined', t => {})

test('An iframe is added before the first HTML block of each specimen', async t => {
	const markdown = readFileSync(`${__dirname}/extractComponent-test-cases/iframes.md`, { encoding: 'utf8' })
	const iframePathFn = ({ componentName, specimenName, language }) => `${componentName}/${specimenName}.${language}`
	const component = await extractComponent(markdown, { iframePathFn })

	t.is(
		component.contentHtml,
		readFileSync(`${__dirname}/extractComponent-test-cases/iframes.expected.html`, {
			encoding: 'utf8',
		})
	)
})
