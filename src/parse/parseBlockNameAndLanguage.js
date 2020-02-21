module.exports = string => {
    const matches = /(.+)\.([^.]+)$/.exec(string || "") // Matches `name.language`
    const [name, language] = matches ? matches.slice(1) : []
    return [name, language]
}
