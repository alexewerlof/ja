#!/usr/bin/env node
const fs = require('fs')
const path = require('path')
const { promisify } = require('util')
const fetch = require('node-fetch')
const { whereFrom } = require('./wherefrom.js')
const { getConfig } = require('./config.js')

const writeFile = promisify(fs.writeFile)
const mkdir = promisify(fs.mkdir)

function fetchFiles(config) {
    return Promise.all(config.map(async ({ source, localFilePath }) => {
        const response = await fetch(whereFrom(source))
        if (!response.ok) {
            throw new Error(`Failed to fetch ${source}`)
        }
        console.log(`Fetched ${source}`)
        return {
            source,
            localFilePath,
            contents: await response.text()
        }
    }))
}

function writeFiles(config) {
    return Promise.all(config.map(async ({ localFilePath, contents }) => {
        const dir = path.dirname(localFilePath)
        if (dir !== '.') {
            console.log(`Creating dir ${dir}...`)
            await mkdir(dir, { recursive: true })
        }
        console.log(`Writing file ${localFilePath}...`)
        return writeFile(localFilePath, contents)
    }))
}

async function main() {
    const config = await getConfig()
    if (config.length === 0) {
        console.log(`Empty config! Nothing to do here!`)
        return
    }
    console.table(config)
    await writeFiles(await fetchFiles(config))
}

module.exports = { main }