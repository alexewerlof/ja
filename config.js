const {
  promises: { readFile },
} = require('fs')
const path = require('path')

const separator = '>'

function validateSource(source) {
  // Throws if source cannot be parsed as a URL
  const sourceUrl = new URL(source)
  if (sourceUrl.pathname === '/') {
    throw new Error(`The source URL is missing a path name: ${source}`)
  }
  if (sourceUrl.pathname.includes('%')) {
    throw new Error(`The source URL has an invalid character: ${sourceUrl.pathname}`)
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
    throw new Error(
      `The local file path is pointing to a directory outside the current directory: ${localFilePath}`
    )
  }

  return localFilePath
}

async function readConfig(configFileName) {
  return await readFile(configFileName, 'utf-8')
}

function parseConfigLine(line) {
  const parts = line.split(separator)
  if (parts.length > 2) {
    throw new Error(`Found more than one separator (${separator}) in "${line}"`)
  }
  const source = parts[0].trim()
  const localFilePath =
    parts.length === 2 ? parts[1].trim() : path.basename(new URL(source).pathname)
  return {
    source: validateSource(source),
    localFilePath: validateLocalFilePath(localFilePath),
  }
}

function parseConfig(config) {
  return config
    .split('\n')
    .filter((line) => {
      // Ignore empty lines and comment lines
      const trimmedLine = line.trim()
      return trimmedLine !== '' && !trimmedLine.startsWith('#')
    })
    .map(parseConfigLine)
}

async function getConfig(configFileName = '.ja') {
  return parseConfig(await readConfig(configFileName))
}

module.exports = { getConfig, _test: { validateSource, validateLocalFilePath, parseConfigLine } }
