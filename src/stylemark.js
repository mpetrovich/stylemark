const fs = require("fs")
const path = require("path")
const globby = require("globby")
const mkdirp = require("mkdirp")
const _ = require("lodash")
const Library = require("./models/Library")
const extractCommentBlocks = require("./parse/extractCommentBlocks")
const parseComponent = require("./parse/parseComponent")
const renderLibrary = require("./render/renderLibrary")

module.exports = config => {
    const cwd = config.cwd || process.cwd()
    const filepaths = globby.sync(config.input, { cwd })
    const components = _.flatMap(filepaths, filepath => {
        const content = fs.readFileSync(filepath, { encoding: "utf8" })
        const isMarkdownFile = filepath.endsWith(".md") || filepath.endsWith(".markdown")
        return isMarkdownFile ? parseComponent(content) : extractCommentBlocks(content).map(parseComponent)
    })
    const name = config.name
    const library = new Library({ name, components })

    const outpath = path.resolve(cwd, config.output)
    const html = renderLibrary(library)
    mkdirp(outpath)
    fs.writeFileSync(path.join(outpath, "index.html"), html)
}
