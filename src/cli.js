#!/usr/bin/env node

/* istanbul ignore file */

const fs = require('fs-extra')
const path = require('path')
const parseComponent = require('./parse/component')
const libraryRenderer = require('./render/library')
const componentRenderer = require('./render/component')
const specimenRenderer = require('./render/specimen')
const blockRenderer = require('./render/block')
const iframePathFn = ({ componentName, specimenName, language }) => `${componentName}/${specimenName}.${language}`

;(async () => {
	const sourcePaths = [
		path.resolve(__dirname, '../docs/examples/button.md'),
		path.resolve(__dirname, '../docs/examples/dropdown.md'),
	]
	const components = await Promise.all(
		sourcePaths.map(sourcePath => {
			const dirpath = path.dirname(sourcePath)
			return parseComponent(fs.readFileSync(sourcePath), { dirpath, iframePathFn, webpackMode: 'development' })
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
