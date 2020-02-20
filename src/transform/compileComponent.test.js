import test from "ava"
import { readFileSync } from "fs"
import path from "path"
import parseComponent from "../parse/component"
import compileComponent from "./compileComponent"

test("Imported files in JS specimen blocks are inlined", async t => {
    const markdown = readFileSync(`${__dirname}/compileComponent-test-cases/imports.md`, { encoding: "utf8" })
    const dirpath = path.resolve(__dirname, "compileComponent-test-cases/")

    var component = parseComponent(markdown)
    component = await compileComponent(component, { dirpath, webpackMode: "development" }) // Development mode prevents minification of imports

    const executableContent1 = component.specimens[0].blocks[0].executableContent
    delete component.specimens[0].blocks[0].executableContent

    // Positive tests
    t.assert(
        executableContent1.indexOf(`var externalImport1 = 'one'`) !== -1,
        "Executable content contains inlined import"
    )
    t.assert(executableContent1.indexOf(`var specimen = 1`) !== -1, "Executable content contains block content")

    // Negative tests
    t.assert(
        executableContent1.indexOf(`var externalImport2 = 'two'`) === -1,
        "Executable content does NOT contain inlined import from a different specimen"
    )
    t.assert(
        executableContent1.indexOf(`var specimen = 2`) === -1,
        "Executable content does NOT contain block content from a different specimen"
    )

    const executableContent2 = component.specimens[1].blocks[0].executableContent
    delete component.specimens[1].blocks[0].executableContent

    // Positive tests
    t.assert(
        executableContent2.indexOf(`var externalImport2 = 'two'`, "Executable content contains inlined import") !== -1
    )
    t.assert(executableContent2.indexOf(`var specimen = 2`) !== -1, "Executable content contains block content")

    // Negative tests
    t.assert(
        executableContent2.indexOf(`var externalImport1 = 'one'`) === -1,
        "Executable content does NOT contain inlined import from a different specimen"
    )
    t.assert(
        executableContent2.indexOf(`var specimen = 1`) === -1,
        "Executable content does NOT contain block content from a different specimen"
    )
})

test.failing("Imported files in CSS specimen blocks are inlined", t => {})
test.failing("Imported files in HTML specimen blocks are inlined", t => {})
