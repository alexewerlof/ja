const fs = require('fs')
const { promisify } = require('util')
const fetch = require('node-fetch')
const am = require('am')

const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)

async function getConfig() {
    const fileContents = await readFile('.moshirc')
    const configs = fileContents.toString()
    return configs
        .split('\n')
        .filter(line => {
            const trimmedLine = line.trim()
            return trimmedLine !== '' && !trimmedLine.startsWith('#')
        })
        .map(line => {
            const colon = line.indexOf(':')
            if (colon === -1) {
                throw new Error(`Could not find ":" in this line: ${line}`)
            }
            return {
                destination: line.substring(0, colon),
                source: line.substr(colon + 1)
            }
        })
}

function sourceUrl(source) {
    // https://github.com/userpixel/micromustache/blob/master/.editorconfig
    // https://raw.githubusercontent.com/userpixel/micromustache/master/.editorconfig
    return source
        .replace('https://github.com/', 'https://raw.githubusercontent.com/')
        .replace('blob/', '')
}

async function main() {
    console.log('hi!')
    const config = await getConfig()
    await Promise.all(config.map(async task => {
        console.log(0, task.source)
        console.log(1, sourceUrl(task.source))
        console.log(2, task.destination)
        const response = await fetch(sourceUrl(task.source))
        writeFile(task.destination, await response.text())
    }))
}

am(main)