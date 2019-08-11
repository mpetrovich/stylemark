import test from 'ava'
import blockRenderer from './blockRenderer'

test('The content of an HTML block is returned unchanged', t => {
	t.is(
		blockRenderer({
			language: 'html',
			executableContent: '<b>HTML content</b>',
		}),
		'<b>HTML content</b>'
	)
})

test('The content of a CSS block is wrapped in a <style> tag', t => {
	t.is(
		blockRenderer({
			language: 'css',
			executableContent: 'b { color: red; }',
		}),
		'<style>b { color: red; }</style>'
	)
})

test('The content of a JS block is wrapped in a <script> tag', t => {
	t.is(
		blockRenderer({
			language: 'js',
			executableContent: 'var foo = "bar";',
		}),
		'<script>var foo = "bar";</script>'
	)
})

test('The content of a block with an unknown lanuage is returned unchanged', t => {
	t.is(
		blockRenderer({
			language: 'unknown',
			executableContent: 'This is unknown content',
		}),
		'This is unknown content'
	)
})
