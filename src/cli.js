#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const extractComponent = require('./extractComponent')
const specimenRenderer = require('./specimenRenderer')
const blockRenderer = require('./blockRenderer')

const sourcePath = path.resolve(__dirname, '../docs/example.md')
const outputPath = path.resolve(__dirname, '../dist/index.html')

const markdown = fs.readFileSync(sourcePath)
const component = extractComponent(markdown, { importLoader: f => '' })
const html = specimenRenderer(component.specimens[0], { blockRenderer })

fs.writeFileSync(outputPath, html)
