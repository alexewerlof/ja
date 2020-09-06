function sourceTokenName(source) {
  const { hostname } = new URL(source)
  return hostname.toUpperCase().replace(/[^\w]/g, '_') + '_TOKEN'
}

function getToken(source) {
  const token = process.env[sourceTokenName(source)]
  if (token) {
      console.log(`Using the token stored in $${envVarName} for ${hostname}`)
      return token
  } else {
      console.info(`Not using a token for ${hostname}`)
  }
}

module.exports = { getToken, _test: { sourceTokenName } }
