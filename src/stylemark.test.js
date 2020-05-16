const test = require("ava")
const fs = require("fs")
const path = require("path")
const stylemark = require("./stylemark")

const testDir = path.resolve(__dirname, "stylemark.test")

test.skip("The config can be provided as an absolute JS filepath", (t) => {
    const filepath = path.join(testDir, "minimal-config.js")
    const expectedConfig = fs.readFileSync(filepath, { encoding: "utf8" })
    const actualConfig = stylemark(filepath)

    t.is(actualConfig.basePath, expectedConfig)
})
