#!/usr/bin/env node

/* istanbul ignore file */

const fs = require('fs-extra')
const path = require('path')
const extractComponent = require('./extractComponent')
const libraryRenderer = require('./libraryRenderer')
const componentRenderer = require('./componentRenderer')
const specimenRenderer = require('./specimenRenderer')
const blockRenderer = require('./blockRenderer')
const iframePathFn = ({ componentName, specimenName, language }) => `${componentName}/${specimenName}.${language}`

;(async () => {
	const sourcePaths = [
		path.resolve(__dirname, '../docs/examples/button.md'),
		path.resolve(__dirname, '../docs/examples/dropdown.md'),
	]
	const components = await Promise.all(
		sourcePaths.map(sourcePath => {
			const dirpath = path.dirname(sourcePath)
			return extractComponent(fs.readFileSync(sourcePath), { dirpath, iframePathFn, webpackMode: 'development' })
		})
	)
	const library = { name: 'Example Library', components }
	const html = libraryRenderer(library, {
		componentRenderer: component =>
			componentRenderer(component, {
				specimenRenderer: specimen => '',
			}),
	})

	library.components.forEach(component => {
		component.specimens.forEach(specimen => {
			const specimenFilepath = path.resolve(
				__dirname,
				'../dist',
				iframePathFn({ componentName: component.name, specimenName: specimen.name, language: 'html' })
			)
			const specimenHtml = specimenRenderer(specimen, { blockRenderer })
			fs.outputFileSync(specimenFilepath, specimenHtml)
		})
	})

	const outputPath = path.resolve(__dirname, '../dist/index.html')
	fs.writeFileSync(outputPath, html)
})()
