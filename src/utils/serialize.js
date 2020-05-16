const _ = require("lodash")

const serialize = (value) => {
    if (_.isArray(value)) {
        return `[${value.map(serialize).join(",")}]`
    } else if (_.isFunction(value)) {
        return value.toString()
    } else if (_.isObject(value)) {
        return `{${_.map(value, (val, key) => `${key}:${serialize(val)}`).join(",")}}`
    } else {
        return JSON.stringify(value)
    }
}

module.exports = serialize
