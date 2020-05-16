const globby = require("globby")

module.exports = (patterns, cwd) => {
    console.log({ patterns, cwd })
    return globby.sync(patterns, { cwd, absolute: true })
}
