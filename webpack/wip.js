const fs = require('fs')
const path = require('path')
const inlineImports = require('../src/inlineImports')

const content = `import exported from './support/exported.js'
import './support/sideeffect.js'
console.log('memfs entry')
exported()
`
const dirpath = path.resolve(__dirname, 'src')
console.log({ dirpath })
;(async () => {
	console.log(await inlineImports(content, { dirpath }))
})()
