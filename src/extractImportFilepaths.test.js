import test from 'ava'
import extractImportFilepaths from './extractImportFilepaths'

test('No import filepaths are extracted if there are no import statements', t => {
	t.deepEqual(extractImportFilepaths('The quick brown fox\njumped over the lazy import dog.'), [])
})

test('Import filepaths are extracted from import statements occurring on their own line anywhere in the content', t => {
	t.deepEqual(
		extractImportFilepaths(
			`import 'path/to/file-1.js'
import 'path/to/file-2.js'
The quick brown fox
import 'path/to/file-3.css'
jumped over the lazy import dog.
import 'path/to/file-4.html'`
		),
		['path/to/file-1.js', 'path/to/file-2.js', 'path/to/file-3.css', 'path/to/file-4.html']
	)
})

test('Import filepaths are extracted from import statements with leading whitespace', t => {
	t.deepEqual(
		extractImportFilepaths(
			` import 'path/to/file-1.js'
import 'path/to/file-2.js'
The quick brown fox
 import 'path/to/file-3.css'
jumped over the lazy import dog.
import 'path/to/file-4.html'`
		),
		['path/to/file-1.js', 'path/to/file-2.js', 'path/to/file-3.css', 'path/to/file-4.html']
	)
})

test('Import filepaths are extracted from import statements with trailing whitespace', t => {
	t.deepEqual(
		extractImportFilepaths(
			"import 'path/to/file-1.js' \n" +
				`import 'path/to/file-2.js'
The quick brown fox
import 'path/to/file-3.css'
jumped over the lazy import dog.
import 'path/to/file-4.html' `
		),
		['path/to/file-1.js', 'path/to/file-2.js', 'path/to/file-3.css', 'path/to/file-4.html']
	)
})
