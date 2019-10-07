#!/usr/bin/env node
const fs = require('fs')
const { promisify } = require('util')
const fetch = require('node-fetch')
const { whereFrom } = require('./wherefrom.js')

const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)

const separator = '>'

async function readConfig() {
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

async function main() {
    const config = parseConfig(await readConfig())
    console.table(config)
    await Promise.all(config.map(async task => {
        console.log(0, task.source)
        console.log(1, whereFrom(task.source))
        console.log(2, task.destination)
        const response = await fetch(whereFrom(task.source))
        writeFile(task.destination, await response.text())
    }))
}

module.exports = { main }