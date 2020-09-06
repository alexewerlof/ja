#!/usr/bin/env -u DEBUG node

const am = require('am')
const { readAndApplyConfig } = require('../index.js')

am(readAndApplyConfig)
