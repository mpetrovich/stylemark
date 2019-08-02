import test from 'ava'
import replaceImportsWithContent from './replaceImportsWithContent.js'

const importFn = filepath => {
	return {
		'path/to/file-1.js': 'Contents of the file-1.js file',
		'path/to/file-2.css': 'Contents of the file-2.css file\ncan span multiple lines',
		'path/to/file-3.html': 'Contents of the file-3.html file',
	}[filepath]
}

test('Content is unchanged if there are no import statements', t => {
	const content = 'The quick brown fox\njumped over the lazy import dog.'

	t.is(replaceImportsWithContent(content, importFn), content)
})

test('Import statements anywhere in the content are replaced with the content of the imported file', t => {
	const actualContent = replaceImportsWithContent(
		`import 'path/to/file-1.js'
The quick brown fox
import 'path/to/file-2.css'
jumped over the lazy import dog.
import 'path/to/file-3.html'`,
		importFn
	)
	const expectedContent = `Contents of the file-1.js file
The quick brown fox
Contents of the file-2.css file
can span multiple lines
jumped over the lazy import dog.
Contents of the file-3.html file`

	t.is(actualContent, expectedContent)
})

test('Import statements can use single quotes', t => {
	const actualContent = replaceImportsWithContent(`import 'path/to/file-1.js'`, importFn)
	const expectedContent = `Contents of the file-1.js file`

	t.is(actualContent, expectedContent)
})

test('Import statements can use double quotes', t => {
	const actualContent = replaceImportsWithContent(`import "path/to/file-1.js"`, importFn)
	const expectedContent = `Contents of the file-1.js file`

	t.is(actualContent, expectedContent)
})

test('Import statements are forgiving of trailing whitespace', t => {
	const actualContent = replaceImportsWithContent("import 'path/to/file-1.js'  \nThe quick brown fox", importFn)
	const expectedContent = `Contents of the file-1.js file\nThe quick brown fox`

	t.is(actualContent, expectedContent)
})

test('Import statements are not forgiving of leading whitespace', t => {
	const actualContent = replaceImportsWithContent(" import 'path/to/file-1.js'\nThe quick brown fox", importFn)
	const expectedContent = " import 'path/to/file-1.js'\nThe quick brown fox"

	t.is(actualContent, expectedContent)
})
