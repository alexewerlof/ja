#!/usr/bin/env node
const {
  promises: { writeFile, mkdir },
} = require('fs')
const path = require('path')
const fetch = require('node-fetch')
const dotenv = require('dotenv')
const createDebug = require('debug')
const { whereFrom } = require('./wherefrom.js')
const { getConfig } = require('./config.js')
const { getToken } = require('./token.js')

dotenv.config({ debug: process.env.DEBUG })

const debug = createDebug('index')

async function readSource(source) {
  const translatedSource = whereFrom(source)
  const headers = {}
  const token = getToken(source)
  if (token) {
    debug('Using a token for %s', source)
    headers['Authorization'] = `token ${token}`
  }
  debug('Fetching %s', source)
  const response = await fetch(translatedSource, { headers })
  if (!response.ok) {
    throw new Error(
      `Failed to fetch ${source} from ${translatedSource}. Error: ${response.status} ${response.statusText}`
    )
  }
  debug('Fetched %s', source)
  return await response.text()
}

async function writeLocalFile(contents, localFilePath) {
  const dir = path.dirname(localFilePath)
  if (dir !== '.') {
    debug(`Ensuring dir exists ${dir}...`)
    await mkdir(dir, { recursive: true })
  }
  debug('Writing file %s...', localFilePath)
  return writeFile(localFilePath, contents)
}

async function readSourceWriteLocalFile({ source, localFilePath }) {
  const contents = await readSource(source)
  return await writeLocalFile(contents, localFilePath)
}

async function applyConfig(config) {
  debug('Applying config %O', config)
  return await Promise.all(config.map(readSourceWriteLocalFile))
}

async function readAndApplyConfig() {
  const config = await getConfig()
  if (config.length === 0) {
    debug('Empty config! Nothing to do here!')
    return
  }
  return await applyConfig(config)
}

module.exports = { readAndApplyConfig }
