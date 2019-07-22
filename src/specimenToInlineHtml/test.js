import test from 'ava'
import { readFileSync } from 'fs'
import toHtml from './src'

test('Nothing is rendered for a specimen without blocks', t => {
	const specimen = {
		name: 'specimen-name',
		blocks: [],
	}
	t.is(toHtml(specimen), '<article></article>')
})

test('Only the HTML blocks of a specimen are rendered', t => {
	const specimen = {
		name: 'specimen-name',
		blocks: [
			{ lang: 'html', props: {}, content: '<b>html content</b>' },
			{ lang: 'css', props: {}, content: 'b { color: red }' },
			{ lang: 'js', props: {}, content: `var foo = 'foo'` },
		],
	}
	t.is(toHtml(specimen), '<article><b>html content</b></article>')
})
