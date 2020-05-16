#!/usr/bin/env node

const debug = require("debug")("stylemark:cli")
const path = require("path")
const _ = require("lodash")
const browser = require("browser-sync")
const chokidar = require("chokidar")
const stylemark = require("./stylemark")

const args = require("yargs")
    .command("$0 <config> [-w|--watch]", "", (yargs) => {
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

const watchLocalFiles = (config) => {
    const isUrl = (asset) => /^https?:\/\//.test(asset)
    const isHtmlElement = (asset) => /^</.test(asset)
    const isLocalFile = (asset) => !isUrl(asset) && !isHtmlElement(asset)

    const inputFiles = config.inputFiles || []
    const assets = Object.values(config.assets) || []
    const themeAssets = Object.values((config.themeConfig && config.themeConfig.assets) || [])
    const localFiles = [].concat(inputFiles, assets, themeAssets).filter(isLocalFile)

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
        stylemark(configPath)

        await watchConfig.localFileWatcher.close()
        watchConfig.localFileWatcher = watchLocalFiles(initialConfig)
    })
    watchConfig.localFileWatcher = watchLocalFiles(initialConfig)
}

const launchBrowser = (config) => {
    browser.create().init({
        ui: false,
        files: path.resolve(config.output, "**", "*.*"),
        watchEvents: ["add", "change"],
        server: config.output,
        notify: false,
    })
}

const run = (args) => {
    const configPath = path.resolve(args.config)
    const config = stylemark(configPath)

    if (args.watch) {
        watchConfig(configPath)
        launchBrowser(config)
    }
}

run(args)
