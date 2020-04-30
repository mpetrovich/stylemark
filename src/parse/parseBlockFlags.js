const _ = require("lodash")

module.exports = (string) => {
    const flags = _.compact(string.trim().split(" "))
    return flags
}
