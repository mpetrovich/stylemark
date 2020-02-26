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

const configPath = path.resolve(args.config)
const config = require(configPath)
const cwd = path.dirname(configPath)
const input = getMatchingFiles(config.input, cwd)
const output = path.isAbsolute(config.output) ? config.output : path.resolve(cwd, config.output)
const name = config.name || "Stylemark"
const debounce = config.debounce || 500
const generate = _.debounce(() => stylemark({ name, input, output }, debounce))

if (args.watch) {
    mkdirp(output)
    chokidar.watch(input, { persistent: true }).on("all", generate)
    browser.create().init({
        ui: false,
        files: path.resolve(output, "**", "*.*"),
        watchEvents: ["add", "change"],
        server: output,
        notify: false,
    })
}

generate()
