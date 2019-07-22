import test from 'ava'
import { readFileSync } from 'fs'
import toHtml from './src'

test('A component with specimens can be rendered to standalone HTML', t => {
	const component = {
		contentHtml: readFileSync(`${__dirname}/test-cases/with-specimens.input-content.html`, { encoding: 'utf8' }),
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
					{ lang: 'js', props: {}, content: `var foo = 'foo'` },
				],
			},
		],
	}
	const specimenToHtml = specimen => `[${specimen.name}]`
	const expectedHtml = readFileSync(`${__dirname}/test-cases/with-specimens.expected.html`, { encoding: 'utf8' })

	t.is(toHtml(component, { specimenToHtml }), expectedHtml)
})
