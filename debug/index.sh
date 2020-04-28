#!/usr/bin/env bash

rm -rf dist
DEBUG=stylemark:* bin/cli.js debug/stylemark.js
