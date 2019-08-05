#!/usr/bin/env node

/* istanbul ignore file */

const fs = require('fs')
const path = require('path')
const extractComponent = require('./extractComponent')
const libraryRenderer = require('./libraryRenderer')
const componentRenderer = require('./componentRenderer')
const specimenRenderer = require('./specimenRenderer')
const blockRenderer = require('./blockRenderer')

const sourcePath = path.resolve(__dirname, '../docs/example.md')
const outputPath = path.resolve(__dirname, '../dist/index.html')

const markdown = fs.readFileSync(sourcePath)
const component = extractComponent(markdown, { importLoader: f => '' })
const library = { name: 'Example Library', components: [component] }

const html = libraryRenderer(library, {
	componentRenderer: component =>
		componentRenderer(component, {
			specimenRenderer: specimen => specimenRenderer(specimen, { blockRenderer }),
		}),
})

fs.writeFileSync(outputPath, html)
