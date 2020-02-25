#!/usr/bin/env node

/* istanbul ignore file */

const stylemark = require("../src/stylemark")
const path = require("path")
const browser = require("browser-sync").create()

const args = require("yargs")
    .usage("Usage: $0 -i [path] -o [path] -n [str]")
    .example('$0 -i "src/**/*.{js,md}" -o "dist/styleguide" -n "ACME Styleguide" -w')
    .option("input", {
        alias: "i",
        type: "string",
        description: "Input path, globs supported",
        demandOption: true,
    })
    .option("output", {
        alias: "o",
        type: "string",
        description: "Output path",
        demandOption: true,
    })
    .option("name", {
        alias: "n",
        type: "string",
        description: "Display name",
    })
    .option("watch", {
        alias: "w",
        type: "boolean",
        description: "Open in a browser and reload on changes",
    }).argv

const input = args.input
const output = args.output
const name = args.name || path.basename(process.cwd())
const watch = args.watch

stylemark({ name, input, output })

if (watch) {
    browser.init({
        ui: false,
        files: path.resolve(output, "**", "*.*"),
        watchEvents: ["add", "change"],
        server: output,
        reloadDebounce: 500,
        notify: false,
    })
}
