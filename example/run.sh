#!/usr/bin/env bash

DEBUG=stylemark:* nodemon --ext js,md --watch src/ --watch example/ --ignore example/dist/ src/cli.js example/stylemark.config.js
