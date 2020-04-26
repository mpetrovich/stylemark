#!/usr/bin/env bash

rm -rf dist
DEBUG=stylemark:cli bin/cli.js debug/stylemark.json
