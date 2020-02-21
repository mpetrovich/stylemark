const visit = require("unist-util-visit")
const parseFrontmatter = require("gray-matter")
const fs = require("fs")
const path = require("path")
const _ = require("lodash")
const Block = require("../model/block")
const Specimen = require("../model/specimen")

const parseBlockName = string => {
    const matches = /(.+)\.([^.]+)$/.exec(string || "") // Matches `(specimenName).(language)`
    const name = matches ? matches[1] : null
    return name
}

const parseBlockLanguage = string => {
    const matches = /(.+)\.([^.]+)$/.exec(string || "") // Matches `(specimenName).(language)`
    const language = matches ? matches[2] : null
    return language
}

const parseBlockFlags = string => {
    const flags = _.compact(string.trim().split(" "))
    return flags
}

module.exports = () => (tree, file) => {
    const specimenBlocks = []

    visit(tree, "code", node => {
        const specimenName = parseBlockName(node.lang)

        if (!specimenName) {
            return
        }

        const language = parseBlockLanguage(node.lang)
        const flags = parseBlockFlags(node.meta || "")
        const frontmatter = parseFrontmatter(node.value)
        const props = frontmatter.data
        const displayContent = frontmatter.content

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
