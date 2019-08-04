#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const extractComponentFromMarkdown = require('./extractComponentFromMarkdown')
const specimenToHtml = require('./specimenToHtml')

const sourcePath = path.resolve(__dirname, '../docs/example.md')
const outputPath = path.resolve(__dirname, '../dist/index.html')

const markdown = fs.readFileSync(sourcePath)
const component = extractComponentFromMarkdown(markdown, { importLoader: f => '' })
const html = specimenToHtml(component.specimens[0])

fs.writeFileSync(outputPath, html)
