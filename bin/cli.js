#!/usr/bin/env node

/* istanbul ignore file */

const path = require("path")
const mkdirp = require("mkdirp")
const _ = require("lodash")
const browser = require("browser-sync")
const chokidar = require("chokidar")
const getMatchingFiles = require("../src/utils/getMatchingFiles")
const stylemark = require("../src/stylemark")

const args = require("yargs")
    .command("$0 <config> [-w|--watch]", "", yargs => {
        yargs.positional("config", {
            description: "JS or JSON config filepath",
            type: "string",
        })
    })
    .demandCommand(1, "ERROR: Must provide a config path")
    .option("watch", {
        alias: "w",
        type: "boolean",
        description: "Open in a browser and reload on changes",
    }).argv

const loadConfig = configPath => {
    console.log(`Loading config from ${configPath}`)
    const config = require(configPath)
    config.cwd = path.dirname(configPath)
    return config
}

const parseConfig = config => {
    const input = getMatchingFiles(config.input, config.cwd)
    const output = path.isAbsolute(config.output) ? config.output : path.resolve(config.cwd, config.output)
    const name = config.name || "Stylemark"
    const debounce = config.debounce || 500
    return { input, output, name, debounce }
}

const generateStyleguide = config => {
    const { input, output, name, debounce } = parseConfig(config)
    // _.debounce(() => {
    console.log(`Generating styleguide in ${output}`)
    stylemark({ input, output, name })
    // }, debounce)
}

const configPath = path.resolve(args.config)
let config = loadConfig(configPath)
console.log(config)
generateStyleguide(config)

if (args.watch) {
    const { input, output } = parseConfig(config)
    mkdirp(output)
    chokidar.watch(input, { persistent: true }).on("all", () => generateStyleguide(config))
    chokidar.watch(configPath, { persistent: true }).on("all", () => {
        config = loadConfig(configPath)
        generateStyleguide(config)
    })
    browser.create().init({
        ui: false,
        files: path.resolve(output, "**", "*.*"),
        watchEvents: ["add", "change"],
        server: output,
        notify: false,
    })
}
