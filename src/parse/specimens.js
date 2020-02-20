const visit = require("unist-util-visit")
const extractFrontmatter = require("gray-matter")
const fs = require("fs")
const path = require("path")
const _ = require("lodash")
const Block = require("../model/block")
const Specimen = require("../model/specimen")

const extractNameAndLanguage = string => {
    const matches = /(.+)\.([^.]+)$/.exec(string || "") // Matches `(specimenName).(language)`
    const [name, language] = matches ? matches.slice(1) : []
    return [name, language]
}

const extractFlags = string => {
    const flags = _.compact(string.trim().split(" "))
    return flags
}

module.exports = () => (tree, file) => {
    const specimenBlocks = []

    visit(tree, "code", node => {
        const [specimenName, language] = extractNameAndLanguage(node.lang)

        if (!specimenName) {
            return
        }

        const parsed = extractFrontmatter(node.value)
        const displayContent = parsed.content
        const props = parsed.data
        const flags = extractFlags(node.meta || "")
        const block = new Block({
            specimenName,
            language,
            flags,
            props,
            displayContent,
        })
        specimenBlocks.push(block)

        node.block = block
        node.value = displayContent
    })

    const specimens = _(specimenBlocks)
        .groupBy("specimenName")
        .map((blocks, specimenName) => new Specimen({ name: specimenName, blocks }))
        .value()
    file.data.specimens = specimens
}
