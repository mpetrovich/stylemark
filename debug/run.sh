#!/usr/bin/env bash

DEBUG=stylemark:* nodemon --ext js,md --watch src/ --watch debug/ --ignore debug/dist/ src/cli.js debug/stylemark.config.js
