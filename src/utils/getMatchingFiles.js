const globby = require("globby")

module.exports = (patterns, cwd) => globby.sync(patterns, { cwd, absolute: true })
