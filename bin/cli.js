#!/usr/bin/env node

/* istanbul ignore file */

const stylemark = require("../src/stylemark")
const path = require("path")
const args = require("yargs")
    .usage("Usage: $0 -i [path] -o [path] -n [str]")
    .example('$0 -i "src/**/*.{js,md}" -o "dist/styleguide" -n "ACME Styleguide"')
    .option("input", {
        alias: "i",
        type: "string",
        description: "Input path, globs supported",
    })
    .option("output", {
        alias: "o",
        type: "string",
        description: "Output path",
    })
    .option("name", {
        alias: "n",
        type: "string",
        description: "Display name",
    })
    .demandOption(["input", "output"]).argv

const input = args.i
const output = args.o
const name = args.n || path.basename(process.cwd())

stylemark({ name, input, output })
