const fs = require("fs")
const path = require("path")
const _ = require("lodash")
const serialize = require("../utils/serialize")

module.exports = (config) => {
    const serializableConfig = _.omitBy(config, _.isFunction)
    serializableConfig.specimenHandlers = config.specimenHandlers.map((handler) => _.pick(handler, ["name", "initDom"]))
    const configString = serialize(serializableConfig)

    const bootstrap = fs.readFileSync(path.resolve(__dirname, "../assets/bootstrap.js"), { encoding: "utf8" })

    return `;
window.stylemark = {};
window.stylemark.config = ${configString};
${bootstrap};
`
}
