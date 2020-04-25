#!/usr/bin/env node

/* istanbul ignore file */

const path = require("path")
const _ = require("lodash")
const browser = require("browser-sync")
const chokidar = require("chokidar")
const debug = require("debug")("stylemark:cli")
const importFresh = require("import-fresh")
const getMatchingFiles = require("../src/utils/getMatchingFiles")
const stylemark = require("../src/index")

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
    debug(`Loading config from: ${configPath}`)
    const config = importFresh(configPath)
    config.cwd = path.dirname(configPath)
    debug("Loaded config", config)
    return config
}

const parseConfig = config => {
    const input = getMatchingFiles(config.input, config.cwd)
    const output = path.isAbsolute(config.output) ? config.output : path.resolve(config.cwd, config.output)
    const name = config.name || "Stylemark"
    const cwd = config.cwd
    debug("Parsed config", { input, output, name, cwd })
    return { input, output, name, cwd }
}

const loadAndParseConfig = configPath => {
    const config = loadConfig(configPath)
    const { input, output, name, cwd } = parseConfig(config)
    return { input, output, name, cwd }
}

const generateStyleguide = ({ input, output, name, cwd }) => {
    debug("Generating styleguide", { input, output, name, cwd })
    stylemark({ input, output, name, cwd })
}

const configPath = path.resolve(args.config)
const { input, output, name, cwd } = loadAndParseConfig(configPath)
generateStyleguide({ input, output, name, cwd })

if (args.watch) {
    chokidar.watch(input, { ignoreInitial: true, persistent: true }).on("all", () => {
        debug(`Change detected in: ${input}`)
        generateStyleguide({ input, output, name, cwd })
    })
    chokidar.watch(configPath, { ignoreInitial: true, persistent: true }).on("all", () => {
        debug(`Change detected in: ${configPath}`)
        const { input, output, name, cwd } = loadAndParseConfig(configPath)
        generateStyleguide({ input, output, name, cwd })
    })
    browser.create().init({
        ui: false,
        files: path.resolve(output, "**", "*.*"),
        watchEvents: ["add", "change"],
        server: output,
        notify: false,
    })
}
