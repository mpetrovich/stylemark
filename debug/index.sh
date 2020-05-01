#!/usr/bin/env bash

rm -rf dist
DEBUG=stylemark:* nodemon --watch src/ src/cli.js debug/stylemark.config.js
