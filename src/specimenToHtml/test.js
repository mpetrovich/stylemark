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
			{ lang: 'html', content: '<b>html content</b>' },
			{ lang: 'css', content: 'b { color: red }' },
			{ lang: 'css', content: 'b { color: green }' },
			{ lang: 'js', content: `var foo = 'foo'` },
			{ lang: 'js', content: `var bar = 'bar'` },
		],
	}
	const expectedHtml = readFileSync(`${__dirname}/test-cases/with-blocks.html`, { encoding: 'utf8' })

	t.is(toHtml(specimen), expectedHtml)
})
