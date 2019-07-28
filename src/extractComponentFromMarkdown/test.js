import test from 'ava'
import readFileSync from 'fs'
import extractComponent from './src'

test('No component is extracted from markdown that does not have frontmatter', t => {
	const markdown = readFileSync(`${__dirname}/test-cases/without-frontmatter.md`, { encoding: 'utf8' })
	const component = extractComponent(markdown)

	t.is(component, null)
})

test('No component is extracted from markdown that has frontmatter but no name property', t => {
	const markdown = readFileSync(`${__dirname}/test-cases/without-frontmatter-name.md`, { encoding: 'utf8' })
	const component = extractComponent(markdown)

	t.is(component, null)
})

test('A component is extracted from markdown that has frontmatter with a name property', t => {
	const markdown = readFileSync(`${__dirname}/test-cases/with-frontmatter-name.md`, { encoding: 'utf8' })
	const component = extractComponent(markdown)

	t.deepEqual(component, {
		contentHtml: readFileSync(`${__dirname}/test-cases/with-frontmatter-name.html`, { encoding: 'utf8' }),
		meta: {
			name: 'Component Name',
			category: 'Component Category',
		},
		specimens: [],
	})
})

test('Specimens are extracted from named code blocks', t => {
	const markdown = readFileSync(`${__dirname}/test-cases/with-specimens.md`, { encoding: 'utf8' })
	const component = extractComponent(markdown)

	t.deepEqual(component, {
		contentHtml: readFileSync(`${__dirname}/test-cases/with-specimens.html`, { encoding: 'utf8' }),
		meta: {
			name: 'Component Name',
			category: 'Component Category',
		},
		specimens: [
			{
				name: 'specimen-1',
				blocks: [
					{ lang: 'html', props: {}, content: '<b>Specimen 1</b>' },
					{ lang: 'css', props: {}, content: 'b { color: red }' },
				],
			},
			{
				name: 'specimen-2',
				blocks: [
					{ lang: 'html', props: {}, content: '<b>Specimen 2</b>' },
					{ lang: 'css', props: {}, content: 'b { color: green }' },
				],
			},
		],
	})
})

test('Specimen blocks can have an inline `hidden` prop and frontmatter props', t => {
	const markdown = readFileSync(`${__dirname}/test-cases/with-specimen-props.md`, { encoding: 'utf8' })
	const component = extractComponent(markdown)

	t.deepEqual(component, {
		contentHtml: readFileSync(`${__dirname}/test-cases/with-specimen-props.html`, { encoding: 'utf8' }),
		meta: {
			name: 'Component Name',
			category: 'Component Category',
		},
		specimens: [
			{
				name: 'specimen-1',
				blocks: [
					{ lang: 'html', props: {}, content: '<b>Specimen 1</b>' },
					{ lang: 'css', props: { hidden: true }, content: 'b { color: red }' },
					{ lang: 'js', props: {}, content: `var foo = 'not hidden'` },
					{ lang: 'js', props: { hidden: true }, content: `var bar = 'hidden'` },
				],
			},
			{
				name: 'specimen-2',
				blocks: [
					{ lang: 'html', props: { hidden: true, key: 'value' }, content: '<b>Specimen 2</b>' },
					{
						lang: 'css',
						props: { hidden: true, key: 'value', list: ['one', 'two', 'three'] },
						content: 'b { color: green }',
					},
				],
			},
		],
	})
})

test.failing('External files referenced within named code blocks are added as hidden specimen code blocks', t => {
	const markdown = readFileSync(`${__dirname}/test-cases/with-external-imports.md`, { encoding: 'utf8' })
	const component = extractComponent(markdown)

	t.deepEqual(component, {
		contentHtml: readFileSync(`${__dirname}/test-cases/with-external-imports.html`, { encoding: 'utf8' }),
		meta: {
			name: 'Component Name',
			category: 'Component Category',
		},
		specimens: [
			{
				name: 'specimen-1',
				blocks: [
					{ lang: 'html', props: {}, content: '<b>Specimen 1</b>' },
					{ lang: 'css', props: {}, content: 'b { color: red }' },
				],
			},
			{
				name: 'specimen-2',
				blocks: [
					{ lang: 'html', props: { hidden: true }, content: '<span>Specimen 2 external import</span>' },
					{ lang: 'html', props: {}, content: '<b>Specimen 2</b>' },
					{ lang: 'js', props: { hidden: true }, content: `var externalImport1 = 'one';` },
					{ lang: 'js', props: { hidden: true }, content: `var externalImport2 = 'two';` },
					{ lang: 'js', props: {}, content: `var specimen = 2;` },
					{ lang: 'css', props: {}, content: 'b { color: green }' },
				],
			},
		],
	})
})

test.failing(
	'Import statements within named code blocks or nested external files are replaced with their content',
	t => {
		const markdown = readFileSync(`${__dirname}/test-cases/with-nested-external-imports.md`, { encoding: 'utf8' })
		const component = extractComponent(markdown)

		t.deepEqual(component, {
			contentHtml: readFileSync(`${__dirname}/test-cases/with-nested-external-imports.html`, { encoding: 'utf8' }),
			meta: {
				name: 'Component Name',
				category: 'Component Category',
			},
			specimens: [
				{
					name: 'specimen-1',
					blocks: [
						{ lang: 'html', props: {}, content: '<b>Specimen 1</b>' },
						{ lang: 'css', props: {}, content: 'b { color: red }' },
					],
				},
				{
					name: 'specimen-2',
					blocks: [
						{ lang: 'css', props: { hidden: true }, content: 'span { color: blue }' },
						{ lang: 'html', props: { hidden: true }, content: '<span>Specimen 2 external import</span>' },
						{ lang: 'html', props: {}, content: '<b>Specimen 2</b>' },
						{ lang: 'js', props: { hidden: true }, content: `var externalImport1 = 'one'` },
						{
							lang: 'js',
							props: { hidden: true },
							content: `var externalImport3 = 'three'\nvar externalImport4 = 'four'\nvar externalImport2 = 'two'`,
						},
						{ lang: 'js', props: {}, content: `var specimen = 2;` },
						{ lang: 'css', props: {}, content: 'b { color: green }' },
					],
				},
			],
		})
	}
)
