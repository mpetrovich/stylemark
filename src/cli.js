#!/usr/bin/env node

/* istanbul ignore file */

const fs = require('fs')
const path = require('path')
const extractComponent = require('./extractComponent')
const libraryRenderer = require('./libraryRenderer')
const componentRenderer = require('./componentRenderer')
const specimenRenderer = require('./specimenRenderer')
const blockRenderer = require('./blockRenderer')

const sourcePaths = [
	path.resolve(__dirname, '../docs/examples/button.md'),
	path.resolve(__dirname, '../docs/examples/dropdown.md'),
]
const components = sourcePaths.map(sourcePath =>
	extractComponent(fs.readFileSync(sourcePath), { importLoader: f => '' })
)
const library = { name: 'Example Library', components }
const html = libraryRenderer(library, {
	componentRenderer: component =>
		componentRenderer(component, {
			specimenRenderer: specimen => specimenRenderer(specimen, { blockRenderer }),
		}),
})

const outputPath = path.resolve(__dirname, '../dist/index.html')
fs.writeFileSync(outputPath, html)
