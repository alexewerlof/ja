#!/usr/bin/env node
const fs = require('fs')
const path = require('path')
const { promisify } = require('util')
const fetch = require('node-fetch')
const { whereFrom } = require('./wherefrom.js')

const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)
const mkdir = promisify(fs.mkdir)

const separator = '>'

async function readConfigFile() {
    const fileContents = await readFile('.ja')
    return fileContents.toString()
}

function parseConfig(config) {
    return config
        .split('\n')
        .filter(line => {
            const trimmedLine = line.trim()
            return trimmedLine !== '' && !trimmedLine.startsWith('#')
        })
        .map(line => {
            const separatorIndex = line.indexOf(separator)
            if (separatorIndex === -1) {
                throw new Error(`Could not find "${separator}" in this line: ${line}`)
            }
            return {
                destination: line.substr(separatorIndex + 1).trim(),
                source: line.substring(0, separatorIndex).trim(),
            }
        })
}

function validateConfig(config) {
    return config.every(({source, destination}) => {
        // Throws source cannot be parsed as a URL
        new URL(source)
        if (path.isAbsolute(destination)) {
            throw new Error(`No absolute paths are allowed but got: ${destination}`)
        }
        return true
    })
}

function fetchFiles(config) {
    return Promise.all(config.map(async ({ source, destination }) => {
        const response = await fetch(whereFrom(source))
        if (!response.ok) {
            throw new Error(`Failed to fetch ${source}`)
        }
        console.log(`Fetched ${source}`)
        return {
            source,
            destination,
            contents: await response.text()
        }
    }))
}

function writeFiles(config) {
    return Promise.all(config.map(async ({destination, contents}) => {
        const dir = path.dirname(destination)
        if (dir !== '.') {
            console.log(`Creating dir ${dir}...`)
            await mkdir(dir, { recursive: true })
        }
        console.log(`Writing file ${destination}...`)
        return writeFile(destination, contents)
    }))
}

async function main() {
    const config = parseConfig(await readConfigFile())
    validateConfig(config)
    if (config.length === 0) {
        console.log(`Empty config! Nothing to do here!`)
        return
    }
    console.table(config)
    await writeFiles(await fetchFiles(config))
}

module.exports = { main }