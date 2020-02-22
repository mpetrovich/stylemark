import test from "ava"
import { readFileSync } from "fs"
import parseComponent from "./parseComponent"
import Block from "../models/Block"
import Specimen from "../models/Specimen"

test("No component is parsed from markdown that does not have frontmatter", async t => {
    const markdown = `
# This is a heading

This is a paragraph.
`
    const component = parseComponent(markdown)

    t.is(component, null)
})

test("No component is parsed from markdown that has frontmatter but no name property", async t => {
    const markdown = `
---
category: Component Category
---

# This is a heading

This is a paragraph.
`
    const component = parseComponent(markdown)

    t.is(component, null)
})

test("A component is parsed from markdown that has frontmatter with a name property", async t => {
    const markdown = `
---
name: Component Name
category: Component Category
tags:
- foo
- bar
---

# This is a heading

This is a paragraph.
`
    const component = parseComponent(markdown)

    t.is(component.markdown, markdown)

    t.deepEqual(component.metadata, {
        name: "Component Name",
        category: "Component Category",
        tags: ["foo", "bar"],
    })
})

test("Specimens are parsed from named code blocks", async t => {
    const markdown = readFileSync(`${__dirname}/parseComponent.test/specimens.input.md`, { encoding: "utf8" })
    const component = parseComponent(markdown)

    t.deepEqual(component.specimens, [
        new Specimen({
            name: "specimen-1",
            blocks: [
                new Block({
                    specimenName: "specimen-1",
                    language: "html",
                    flags: [],
                    props: {},
                    content: "<b>Specimen 1</b>",
                }),
                new Block({
                    specimenName: "specimen-1",
                    language: "css",
                    flags: [],
                    props: {},
                    content: "b { color: red }",
                }),
            ],
        }),
        new Specimen({
            name: "specimen-2",
            blocks: [
                new Block({
                    specimenName: "specimen-2",
                    language: "html",
                    flags: [],
                    props: {},
                    content: "<b>Specimen 2</b>",
                }),
                new Block({
                    specimenName: "specimen-2",
                    language: "css",
                    flags: [],
                    props: {},
                    content: "b { color: green }",
                }),
            ],
        }),
    ])
})

test("Specimen blocks can have arbitrary inline flags", async t => {
    const markdown = readFileSync(`${__dirname}/parseComponent.test/specimen-flags.input.md`, { encoding: "utf8" })
    const component = parseComponent(markdown)

    t.deepEqual(component.specimens, [
        new Specimen({
            name: "specimen",
            blocks: [
                new Block({
                    specimenName: "specimen",
                    language: "html",
                    flags: [],
                    props: {},
                    content: "<b>Specimen</b>",
                }),
                new Block({
                    specimenName: "specimen",
                    language: "css",
                    flags: ["hidden", "foo"],
                    props: {},
                    content: "b { color: red }",
                }),
                new Block({
                    specimenName: "specimen",
                    language: "js",
                    flags: ["bar", "not-hidden"],
                    props: {},
                    content: `var foo = 'not hidden'`,
                }),
                new Block({
                    specimenName: "specimen",
                    language: "js",
                    flags: ["foo", "hidden", "bar"],
                    props: {},
                    content: `var bar = 'hidden'`,
                }),
            ],
        }),
    ])
})

test("Specimen blocks can have arbitrary frontmatter props", async t => {
    const markdown = readFileSync(`${__dirname}/parseComponent.test/specimen-props.input.md`, { encoding: "utf8" })
    const component = parseComponent(markdown)

    t.deepEqual(component.specimens, [
        new Specimen({
            name: "specimen",
            blocks: [
                new Block({
                    specimenName: "specimen",
                    language: "html",
                    flags: [],
                    props: { key: "value" },
                    content: "<b>Specimen</b>",
                }),
                new Block({
                    specimenName: "specimen",
                    language: "css",
                    flags: ["hidden"],
                    props: { key: "value", list: ["one", "two", "three"] },
                    content: "b { color: green }",
                }),
            ],
        }),
    ])
})
