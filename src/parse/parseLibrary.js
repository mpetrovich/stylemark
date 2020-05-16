const fs = require("fs")
const _ = require("lodash")
const extractCommentBlocks = require("./extractCommentBlocks")
const parseComponent = require("./parseComponent")
const Library = require("../models/Library")

const parseLibrary = (inputFiles) => {
    const components = parseComponents(inputFiles)
    return new Library({ components })
}

const parseComponents = (files) => {
    const components = _.flatMap(files, parseComponentsFromFile)
    return components
}

const parseComponentsFromFile = (file) => {
    const content = fs.readFileSync(file, { encoding: "utf8" })
    const isMarkdownFile = file.endsWith(".md") || file.endsWith(".markdown")
    const components = isMarkdownFile ? parseComponent(content) : extractCommentBlocks(content).map(parseComponent)
    return components
}

module.exports = parseLibrary
