import test from 'ava'
import { readFileSync } from 'fs'
import path from 'path'
import extractComponent from './extractComponent'

test('No component is extracted from markdown that does not have frontmatter', t => {
	const markdown = readFileSync(`${__dirname}/extractComponent-test-cases/no-frontmatter.md`, {
		encoding: 'utf8',
	})
	const component = extractComponent(markdown)

	t.is(component, null)
})

test('No component is extracted from markdown that has frontmatter but no name property', t => {
	const markdown = readFileSync(`${__dirname}/extractComponent-test-cases/no-frontmatter-name.md`, {
		encoding: 'utf8',
	})
	const component = extractComponent(markdown)

	t.is(component, null)
})

test('A component is extracted from markdown that has frontmatter with a name property', t => {
	const markdown = readFileSync(`${__dirname}/extractComponent-test-cases/frontmatter.md`, {
		encoding: 'utf8',
	})
	const component = extractComponent(markdown)

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

test('Specimens are extracted from named code blocks', t => {
	const markdown = readFileSync(`${__dirname}/extractComponent-test-cases/specimens.md`, {
		encoding: 'utf8',
	})
	const component = extractComponent(markdown)

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
						executeContent: '<b>Specimen 1</b>',
						displayContent: '<b>Specimen 1</b>',
					},
					{
						language: 'css',
						flags: {},
						props: {},
						executeContent: 'b { color: red }',
						displayContent: 'b { color: red }',
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
						executeContent: '<b>Specimen 2</b>',
						displayContent: '<b>Specimen 2</b>',
					},
					{
						language: 'css',
						flags: {},
						props: {},
						executeContent: 'b { color: green }',
						displayContent: 'b { color: green }',
					},
				],
			},
		],
	})
})

test('Specimen blocks can have inline flags', t => {
	const markdown = readFileSync(`${__dirname}/extractComponent-test-cases/specimen-flags.md`, {
		encoding: 'utf8',
	})
	const component = extractComponent(markdown)

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
						executeContent: '<b>Specimen</b>',
						displayContent: '<b>Specimen</b>',
					},
					{
						language: 'css',
						flags: { hidden: true },
						props: {},
						executeContent: 'b { color: red }',
						displayContent: 'b { color: red }',
					},
					{
						language: 'js',
						flags: {},
						props: {},
						executeContent: `var foo = 'not hidden'`,
						displayContent: `var foo = 'not hidden'`,
					},
					{
						language: 'js',
						flags: { hidden: true },
						props: {},
						executeContent: `var bar = 'hidden'`,
						displayContent: `var bar = 'hidden'`,
					},
				],
			},
		],
	})
})

test('Specimen blocks can have frontmatter props', t => {
	const markdown = readFileSync(`${__dirname}/extractComponent-test-cases/specimen-props.md`, {
		encoding: 'utf8',
	})
	const component = extractComponent(markdown)

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
						executeContent: '<b>Specimen</b>',
						displayContent: '<b>Specimen</b>',
					},
					{
						language: 'css',
						flags: { hidden: true },
						props: { key: 'value', list: ['one', 'two', 'three'] },
						executeContent: 'b { color: green }',
						displayContent: 'b { color: green }',
					},
				],
			},
		],
	})
})

test('Import statements in code blocks are added as hidden specimen blocks', t => {
	const markdown = readFileSync(`${__dirname}/extractComponent-test-cases/imports.md`, { encoding: 'utf8' })
	const dirpath = path.resolve(__dirname, '/extractComponent-test-cases/')
	const component = extractComponent(markdown, { dirpath })

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
						language: 'html',
						flags: {},
						props: {},
						executeContent: '<b>Specimen 1</b>',
						displayContent: '<b>Specimen 1</b>',
					},
					{
						language: 'css',
						flags: {},
						props: {},
						executeContent: 'b { color: red }',
						displayContent: 'b { color: red }',
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
						executeContent: '<span>Specimen 2 external import</span>',
						displayContent: '<span>Specimen 2 external import</span>',
					},
					{
						language: 'html',
						flags: {},
						props: {},
						executeContent: '<b>Specimen 2</b>',
						displayContent: '<b>Specimen 2</b>',
					},
					{
						language: 'js',
						flags: { hidden: true },
						props: {},
						executeContent: `var externalImport1 = 'one'`,
						displayContent: `var externalImport1 = 'one'`,
					},
					{
						language: 'js',
						flags: { hidden: true },
						props: {},
						executeContent: `var externalImport2 = 'two'`,
						displayContent: `var externalImport2 = 'two'`,
					},
					{
						language: 'js',
						flags: {},
						props: {},
						executeContent: `var specimen = 2`,
						displayContent: `var specimen = 2`,
					},
					{
						language: 'css',
						flags: {},
						props: {},
						executeContent: 'b { color: green }',
						displayContent: 'b { color: green }',
					},
				],
			},
		],
	})
})

test('An iframe is added before the first HTML block (hidden or non-hidden) of each specimen', t => {
	const markdown = readFileSync(`${__dirname}/extractComponent-test-cases/iframes.md`, { encoding: 'utf8' })
	const iframePathFn = ({ componentName, specimenName, language }) => `${componentName}/${specimenName}.${language}`
	const component = extractComponent(markdown, { iframePathFn })

	t.is(
		component.contentHtml,
		readFileSync(`${__dirname}/extractComponent-test-cases/iframes.expected.html`, {
			encoding: 'utf8',
		})
	)
})
