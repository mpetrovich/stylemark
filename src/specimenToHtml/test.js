import test from 'ava'
import { readFileSync } from 'fs'
import toHtml from './src'

test('Nothing is rendered for a specimen without blocks', t => {
	const specimen = {
		name: 'specimen-name',
		blocks: [],
	}
	const expectedHtml = readFileSync(`${__dirname}/test-cases/without-blocks.html`, { encoding: 'utf8' })

	t.is(toHtml(specimen), expectedHtml)
})

test('Specimen blocks for every language are rendered', t => {
	const specimen = {
		name: 'specimen-name',
		blocks: [
			{ lang: 'html', props: {}, content: '<b>html content</b>' },
			{ lang: 'css', props: {}, content: 'b { color: red }' },
			{ lang: 'css', props: {}, content: 'b { color: green }' },
			{ lang: 'js', props: {}, content: `var foo = 'foo'` },
		],
	}
	const expectedHtml = readFileSync(`${__dirname}/test-cases/specimen-languages.html`, { encoding: 'utf8' })

	t.is(toHtml(specimen), expectedHtml)
})
