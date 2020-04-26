module.exports = string => {
    const matches = /(.+)\.([^.]+)$/.exec(string || "") // Matches `name.type`
    const [name, type] = matches ? matches.slice(1) : []
    return [name, type]
}
