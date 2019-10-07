const fs = require('fs')
const path = require('path')
const { promisify } = require('util')

const readFile = promisify(fs.readFile)

const separator = '>'

function validateSource(source) {
    // Throws if source cannot be parsed as a URL
    const sourceUrl = new URL(source)
    if (sourceUrl.pathname === '/') {
        throw new Error(`The source URL is missing a path name: ${source}`)
    }
    return source
}

function validateLocalFilePath(localFilePath) {
    if (localFilePath === '') {
        throw new Error(`The local file path cannot be empty`)
    }
    if (localFilePath.includes(separator)) {
        throw new Error(`Invalid local file path containing "${separator}": ${localFilePath}`)
    }
    if (localFilePath.endsWith(path.sep)) {
        throw new Error(`The local file path cannot be a directory: ${localFilePath}`)
    }
    if (path.isAbsolute(localFilePath)) {
        throw new Error(`No absolute paths are allowed but got: ${localFilePath}`)
    }
    const cwd = process.cwd()
    const absolutePath = path.resolve(cwd, localFilePath)
    if (!absolutePath.startsWith(cwd)) {
        throw new Error(`The local file path is pointing to a directory outside the current directory: ${localFilePath}`)
    }

    return localFilePath
}

async function readConfigFile(configFileName) {
    const fileContents = await readFile(configFileName)
    return fileContents.toString()
}

function parseConfigLine(line) {
    const separatorIndex = line.indexOf(separator)
    if (separatorIndex === -1) {
        throw new Error(`Could not find "${separator}" in this line: ${line}`)
    }
    return {
        source: validateSource(line.substring(0, separatorIndex).trim()),
        localFilePath: validateLocalFilePath(line.substr(separatorIndex + 1).trim()),
    }
}

function parseConfig(config) {
    return config
        .split('\n')
        .filter(line => {
            const trimmedLine = line.trim()
            return trimmedLine !== '' && !trimmedLine.startsWith('#')
        })
        .map(parseConfigLine)
}

async function getConfig(configFileName = '.ja') {
    return parseConfig(await readConfigFile(configFileName))
}

module.exports = { getConfig, _test: { validateSource, validateLocalFilePath, parseConfigLine } }