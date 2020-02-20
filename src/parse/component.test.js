import test from "ava"
import { readFileSync } from "fs"
import _ from "lodash"
import parseComponent from "./component"
import Block from "../model/block"
import Specimen from "../model/specimen"

test("No component is extracted from markdown that does not have frontmatter", async t => {
    const markdown = readFileSync(`${__dirname}/component-test-cases/no-frontmatter.md`, { encoding: "utf8" })
    const component = parseComponent(markdown)

    t.is(component, null)
})

test("No component is extracted from markdown that has frontmatter but no name property", async t => {
    const markdown = readFileSync(`${__dirname}/component-test-cases/no-frontmatter-name.md`, { encoding: "utf8" })
    const component = parseComponent(markdown)

    t.is(component, null)
})

test("A component is extracted from markdown that has frontmatter with a name property", async t => {
    const markdown = readFileSync(`${__dirname}/component-test-cases/frontmatter.md`, { encoding: "utf8" })
    const component = parseComponent(markdown)

    t.is(component.markdown, markdown)

    t.deepEqual(component.metadata, {
        name: "Component Name",
        category: "Component Category",
    })
})

test("Specimens are extracted from named code blocks", async t => {
    const markdown = readFileSync(`${__dirname}/component-test-cases/specimens.md`, { encoding: "utf8" })
    const component = parseComponent(markdown)

    t.deepEqual(component.specimens, [
        new Specimen({
            name: "specimen-1",
            blocks: [
                new Block({
                    specimenName: "specimen-1",
                    language: "html",
                    flags: {},
                    props: {},
                    displayContent: "<b>Specimen 1</b>",
                }),
                new Block({
                    specimenName: "specimen-1",
                    language: "css",
                    flags: {},
                    props: {},
                    displayContent: "b { color: red }",
                }),
            ],
        }),
        new Specimen({
            name: "specimen-2",
            blocks: [
                new Block({
                    specimenName: "specimen-2",
                    language: "html",
                    flags: {},
                    props: {},
                    displayContent: "<b>Specimen 2</b>",
                }),
                new Block({
                    specimenName: "specimen-2",
                    language: "css",
                    flags: {},
                    props: {},
                    displayContent: "b { color: green }",
                }),
            ],
        }),
    ])
})

test("Specimen blocks can have arbitrary inline flags", async t => {
    const markdown = readFileSync(`${__dirname}/component-test-cases/specimen-flags.md`, { encoding: "utf8" })
    const component = parseComponent(markdown)

    t.deepEqual(component.specimens, [
        new Specimen({
            name: "specimen",
            blocks: [
                new Block({
                    specimenName: "specimen",
                    language: "html",
                    flags: {},
                    props: {},
                    displayContent: "<b>Specimen</b>",
                }),
                new Block({
                    specimenName: "specimen",
                    language: "css",
                    flags: { hidden: true, foo: true },
                    props: {},
                    displayContent: "b { color: red }",
                }),
                new Block({
                    specimenName: "specimen",
                    language: "js",
                    flags: { bar: true, "not-hidden": true },
                    props: {},
                    displayContent: `var foo = 'not hidden'`,
                }),
                new Block({
                    specimenName: "specimen",
                    language: "js",
                    flags: { hidden: true, foo: true, bar: true },
                    props: {},
                    displayContent: `var bar = 'hidden'`,
                }),
            ],
        }),
    ])
})

test("Specimen blocks can have arbitrary frontmatter props", async t => {
    const markdown = readFileSync(`${__dirname}/component-test-cases/specimen-props.md`, { encoding: "utf8" })
    const component = parseComponent(markdown)

    t.deepEqual(component.specimens, [
        new Specimen({
            name: "specimen",
            blocks: [
                new Block({
                    specimenName: "specimen",
                    language: "html",
                    flags: {},
                    props: { key: "value" },
                    displayContent: "<b>Specimen</b>",
                }),
                new Block({
                    specimenName: "specimen",
                    language: "css",
                    flags: { hidden: true },
                    props: { key: "value", list: ["one", "two", "three"] },
                    displayContent: "b { color: green }",
                }),
            ],
        }),
    ])
})
