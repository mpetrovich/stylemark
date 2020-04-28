const debug = require("debug")("stylemark:copy-files")
const path = require("path")
const cpy = require("cpy")
const cpFile = require("cp-file")
const isGlob = require("is-glob")

module.exports = async (cwd, from, to) => {
    try {
        if (isGlob(from)) {
            debug(`Copying files from "${from}" to "${to}"`)
            await cpy(from, to, { cwd: cwd })
        } else {
            from = path.resolve(cwd, from)
            debug(`Copying file from "${from}" to "${to}"`)
            await cpFile(from, to)
        }
    } catch (error) {
        debug(`Error copying files "${from}" to "${to}":`, error)
    }
}
