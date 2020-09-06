#!/usr/bin/env node
const { promises: { writeFile, mkdir } } = require('fs')
const path = require('path')
const fetch = require('node-fetch')
const dotenv = require('dotenv')
const { whereFrom } = require('./wherefrom.js')
const { getConfig } = require('./config.js')
const { getToken } = require('./token.js')

dotenv.config({ debug: process.env.DEBUG })

async function readSource(source) {
    const translatedSource = whereFrom(source)
    const token = getToken(source)
    const headers = {}
    if (token) {
        headers['Authorization'] = `token ${token}`
    }
    const response = await fetch(translatedSource, { headers })
    if (!response.ok) {
        throw new Error(`Failed to fetch ${source} from ${translatedSource}. Error: ${response.status} ${response.statusText}`)
    }
    console.log(`Fetched ${source}`)
    return await response.text()
}

async function writeDestination(contents, localFilePath) {
    const dir = path.dirname(localFilePath)
    if (dir !== '.') {
        console.log(`Ensuring dir exists ${dir}...`)
        await mkdir(dir, { recursive: true })
    }
    console.log(`Writing file ${localFilePath}...`)
    return writeFile(localFilePath, contents)
}

async function readSourceWriteDestination({ source, localFilePath }) {
    const contents = await readSource(source)
    return await writeDestination(contents, localFilePath)
}

async function applyConfig(config) {
  console.table(config)
  return await Promise.all(config.map(readSourceWriteDestination))
}

async function readAndApplyConfig() {
    const config = await getConfig()
    if (config.length === 0) {
        console.log(`Empty config! Nothing to do here!`)
        return
    }
    return await applyConfig(config)
}

module.exports = { readAndApplyConfig }
