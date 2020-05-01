#!/usr/bin/env bash

rm -rf debug/dist
DEBUG=stylemark:* nodemon --watch src/ src/cli.js debug/stylemark.config.js
