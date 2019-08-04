import test from 'ava'
import extractImportFilepaths from './extractImportFilepaths'

test('Nothing is exported content contains no import statements', t => {
	t.deepEqual(extractImportFilepaths('The quick brown fox\njumped over the lazy import dog.'), [])
})

test('Import statements occurring on their own line anywhere in the content are removed', t => {
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

test('Import statements with leading whitespace are not removed', t => {
	t.deepEqual(extractImportFilepaths("import 'path/to/file.js'\nThe quick brown fox"), ['path/to/file.js'])
})

test('Import statements with trailing whitespace are removed', t => {
	t.deepEqual(extractImportFilepaths("import 'path/to/file.js'  \nThe quick brown fox"), ['path/to/file.js'])
})
