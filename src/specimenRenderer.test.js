import test from 'ava'
import { readFileSync } from 'fs'
import toHtml from './specimenRenderer'

test('Nothing is rendered for a specimen without blocks', t => {
	const specimen = {
		name: 'specimen-name',
		blocks: [],
	}
	const expectedHtml = readFileSync(`${__dirname}/specimenRenderer-test-cases/no-blocks.html`, { encoding: 'utf8' })

	t.is(toHtml(specimen), expectedHtml)
})

test('Specimen blocks for HTML, CSS, and JS are rendered', t => {
	const specimen = {
		name: 'specimen-name',
		blocks: [
			{ language: 'html', content: '<b>html content</b>' },
			{ language: 'css', content: 'b { color: red }' },
			{ language: 'css', content: 'b { color: green }' },
			{ language: 'js', content: `var foo = 'foo'` },
			{ language: 'js', content: `var bar = 'bar'` },
		],
	}
	const expectedHtml = readFileSync(`${__dirname}/specimenRenderer-test-cases/blocks.html`, { encoding: 'utf8' })

	t.is(toHtml(specimen), expectedHtml)
})
