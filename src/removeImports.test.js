import test from 'ava'
import removeImports from './removeImports'

test('Content is unchanged if there are no import statements', t => {
	t.is(
		removeImports('The quick brown fox\njumped over the lazy import dog.'),
		'The quick brown fox\njumped over the lazy import dog.'
	)
})

test('Import statements occurring on their own line anywhere in the content are removed', t => {
	t.is(
		removeImports(
			`import 'path/to/file-1.js'
import 'path/to/file-2.js'
The quick brown fox
import 'path/to/file-3.css'
jumped over the lazy import dog.
import 'path/to/file-4.html'`
		),
		`The quick brown fox

jumped over the lazy import dog.`
	)
})

test('Import statements with leading whitespace are removed', t => {
	t.is(
		removeImports(
			` import 'path/to/file-1.js'
import 'path/to/file-2.js'
The quick brown fox
 import 'path/to/file-3.css'
jumped over the lazy import dog.
import 'path/to/file-4.html'`
		),
		`The quick brown fox

jumped over the lazy import dog.`
	)
})

test('Import statements with trailing whitespace are removed', t => {
	t.is(
		removeImports(
			"import 'path/to/file-1.js' \n" +
				`import 'path/to/file-2.js'
The quick brown fox
import 'path/to/file-3.css'
jumped over the lazy import dog.
import 'path/to/file-4.html' `
		),
		`The quick brown fox

jumped over the lazy import dog.`
	)
})
