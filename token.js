const createDebug = require('debug')

const debug = createDebug('token')

function sourceTokenName(source) {
  const { hostname } = new URL(source)
  return hostname.toUpperCase().replace(/[^\w]/g, '_') + '_TOKEN'
}

function getToken(source) {
  const token = process.env[sourceTokenName(source)]
  if (token) {
    debug('Using the token stored in $%s for %s', envVarName, source)
    return token
  } else {
    debug('No token set for %s', source)
  }
}

module.exports = { getToken, _test: { sourceTokenName } }
