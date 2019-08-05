import test from 'ava'
import { readFileSync } from 'fs'
import path from 'path'
import extractComponent from './extractComponent'

test('No component is extracted from markdown that does not have frontmatter', t => {
	const markdown = readFileSync(`${__dirname}/extractComponent-test-cases/no-frontmatter.md`, {
		encoding: 'utf8',
	})
	const component = extractComponent(markdown, { importLoader: v => v })

	t.is(component, null)
})

test('No component is extracted from markdown that has frontmatter but no name property', t => {
	const markdown = readFileSync(`${__dirname}/extractComponent-test-cases/no-frontmatter-name.md`, {
		encoding: 'utf8',
	})
	const component = extractComponent(markdown, { importLoader: v => v })

	t.is(component, null)
})

test('A component is extracted from markdown that has frontmatter with a name property', t => {
	const markdown = readFileSync(`${__dirname}/extractComponent-test-cases/frontmatter.md`, {
		encoding: 'utf8',
	})
	const component = extractComponent(markdown, { importLoader: v => v })

	t.deepEqual(component, {
		contentHtml: readFileSync(`${__dirname}/extractComponent-test-cases/frontmatter.expected.html`, {
			encoding: 'utf8',
		}),
		meta: {
			name: 'Component Name',
			category: 'Component Category',
		},
		specimens: [],
	})
})

test('Specimens are extracted from named code blocks', t => {
	const markdown = readFileSync(`${__dirname}/extractComponent-test-cases/specimens.md`, {
		encoding: 'utf8',
	})
	const component = extractComponent(markdown, { importLoader: v => v })

	t.deepEqual(component, {
		contentHtml: readFileSync(`${__dirname}/extractComponent-test-cases/specimens.expected.html`, {
			encoding: 'utf8',
		}),
		meta: {
			name: 'Component Name',
			category: 'Component Category',
		},
		specimens: [
			{
				name: 'specimen-1',
				blocks: [
					{ language: 'html', flags: {}, props: {}, content: '<b>Specimen 1</b>' },
					{ language: 'css', flags: {}, props: {}, content: 'b { color: red }' },
				],
			},
			{
				name: 'specimen-2',
				blocks: [
					{ language: 'html', flags: {}, props: {}, content: '<b>Specimen 2</b>' },
					{ language: 'css', flags: {}, props: {}, content: 'b { color: green }' },
				],
			},
		],
	})
})

test('Specimen blocks can have inline flags', t => {
	const markdown = readFileSync(`${__dirname}/extractComponent-test-cases/specimen-flags.md`, {
		encoding: 'utf8',
	})
	const component = extractComponent(markdown, { importLoader: v => v })

	t.deepEqual(component, {
		contentHtml: readFileSync(`${__dirname}/extractComponent-test-cases/specimen-flags.expected.html`, {
			encoding: 'utf8',
		}),
		meta: {
			name: 'Component Name',
			category: 'Component Category',
		},
		specimens: [
			{
				name: 'specimen',
				blocks: [
					{ language: 'html', flags: {}, props: {}, content: '<b>Specimen</b>' },
					{ language: 'css', flags: { hidden: true }, props: {}, content: 'b { color: red }' },
					{ language: 'js', flags: {}, props: {}, content: `var foo = 'not hidden'` },
					{ language: 'js', flags: { hidden: true }, props: {}, content: `var bar = 'hidden'` },
				],
			},
		],
	})
})

test('Specimen blocks can have frontmatter props', t => {
	const markdown = readFileSync(`${__dirname}/extractComponent-test-cases/specimen-props.md`, {
		encoding: 'utf8',
	})
	const component = extractComponent(markdown, { importLoader: v => v })

	t.deepEqual(component, {
		contentHtml: readFileSync(`${__dirname}/extractComponent-test-cases/specimen-props.expected.html`, {
			encoding: 'utf8',
		}),
		meta: {
			name: 'Component Name',
			category: 'Component Category',
		},
		specimens: [
			{
				name: 'specimen',
				blocks: [
					{ language: 'html', flags: {}, props: { key: 'value' }, content: '<b>Specimen</b>' },
					{
						language: 'css',
						flags: { hidden: true },
						props: { key: 'value', list: ['one', 'two', 'three'] },
						content: 'b { color: green }',
					},
				],
			},
		],
	})
})

test('Import statements in code blocks are added as hidden specimen blocks', t => {
	const markdown = readFileSync(`${__dirname}/extractComponent-test-cases/imports.md`, { encoding: 'utf8' })
	const importLoader = filepath =>
		readFileSync(path.resolve(`${__dirname}/extractComponent-test-cases/`, filepath), { encoding: 'utf8' })
	const component = extractComponent(markdown, { importLoader })

	t.deepEqual(component, {
		contentHtml: readFileSync(`${__dirname}/extractComponent-test-cases/imports.expected.html`, {
			encoding: 'utf8',
		}),
		meta: {
			name: 'Component Name',
			category: 'Component Category',
		},
		specimens: [
			{
				name: 'specimen-1',
				blocks: [
					{ language: 'html', flags: {}, props: {}, content: '<b>Specimen 1</b>' },
					{ language: 'css', flags: {}, props: {}, content: 'b { color: red }' },
				],
			},
			{
				name: 'specimen-2',
				blocks: [
					{ language: 'html', flags: {}, props: {}, content: '<span>Specimen 2 external import</span>' },
					{ language: 'html', flags: {}, props: {}, content: '<b>Specimen 2</b>' },
					{ language: 'js', flags: { hidden: true }, props: {}, content: `var externalImport1 = 'one'` },
					{ language: 'js', flags: { hidden: true }, props: {}, content: `var externalImport2 = 'two'` },
					{ language: 'js', flags: {}, props: {}, content: `var specimen = 2` },
					{ language: 'css', flags: {}, props: {}, content: 'b { color: green }' },
				],
			},
		],
	})
})
