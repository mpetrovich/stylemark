#!/usr/bin/env node

/* istanbul ignore file */

const path = require("path")
const _ = require("lodash")
const browser = require("browser-sync")
const chokidar = require("chokidar")
const debug = require("debug")("stylemark:cli")
const importFresh = require("import-fresh")
const getMatchingFiles = require("../src/utils/getMatchingFiles")
const Config = require("../src/models/Config")
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
    debug("Loading config from:", configPath)
    const raw = importFresh(configPath)
    raw.cwd = path.dirname(configPath)
    debug("Loaded config", raw)

    raw.input = getMatchingFiles(raw.input, raw.cwd)
    raw.output = path.isAbsolute(raw.output) ? raw.output : path.resolve(raw.cwd, raw.output)
    const config = new Config(raw)
    debug("Parsed config", config)

    return config
}

const watchLocalFiles = config => {
    const isLocalFile = str => str && /^(<|https?:|:\/\/)/.test(str) === false
    const localFiles = [].concat(config.input, config.head, config.body, Object.keys(config.assets)).filter(isLocalFile)

    debug("Watching for changes in:", localFiles)
    const watcher = chokidar
        .watch(localFiles, { cwd: config.cwd, ignoreInitial: true, persistent: true })
        .on("all", () => {
            debug("Change detected in:", localFiles)
            stylemark(config)
        })
    return watcher
}

const watchConfig = (configPath, initialConfig) => {
    chokidar.watch(configPath, { ignoreInitial: true, persistent: true }).on("all", async () => {
        debug("Change detected in:", configPath)
        const config = loadConfig(configPath)
        stylemark(config)

        await watchConfig.localFileWatcher.close()
        watchConfig.localFileWatcher = watchLocalFiles(config)
    })

    watchConfig.localFileWatcher = watchLocalFiles(initialConfig)
}

const launchBrowser = config => {
    browser.create().init({
        ui: false,
        files: path.resolve(config.output, "**", "*.*"),
        watchEvents: ["add", "change"],
        server: config.output,
        notify: false,
    })
}

const run = args => {
    const configPath = path.resolve(args.config)
    const config = loadConfig(configPath)
    stylemark(config)

    if (args.watch) {
        watchConfig(configPath, config)
        launchBrowser(config)
    }
}

run(args)
