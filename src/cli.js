#!/usr/bin/env node

/* istanbul ignore file */

const fs = require('fs-extra')
const path = require('path')
const Library = require('./model/library')
const parseComponent = require('./parse/component')
const compileComponent = require('./transform/compileComponent')
const renderComponent = require('./render/component')
const renderLibrary = require('./render/library')
const renderSpecimen = require('./render/specimen')
const renderBlock = require('./render/block')

const iframePathFn = ({ component, specimen }) => `${component.metadata.name}/${specimen.name}.html`

;(async () => {
	const sourcePaths = [
		path.resolve(__dirname, '../docs/examples/button.md'),
		path.resolve(__dirname, '../docs/examples/dropdown.md'),
	]

	const components = await Promise.all(
		sourcePaths.map(async sourcePath => {
			const dirpath = path.dirname(sourcePath)
			var component = parseComponent(fs.readFileSync(sourcePath))
			component = await compileComponent(component, { dirpath, webpackMode: 'development' })
			component = renderComponent(component, { iframePathFn })
			return component
		})
	)

	const library = new Library({ name: 'Example Library', components })

	library.components.forEach(component => {
		component.specimens.forEach(specimen => {
			const specimenFilepath = path.resolve(__dirname, '../dist', iframePathFn({ component, specimen }))
			const specimenHtml = renderSpecimen(specimen, { renderBlock })
			fs.outputFileSync(specimenFilepath, specimenHtml)
		})
	})
	const html = renderLibrary(library)

	const outputPath = path.resolve(__dirname, '../dist/index.html')
	fs.writeFileSync(outputPath, html)
})()
