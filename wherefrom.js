const { URL } = require('url')

function whereFrom(source) {
  const ret = new URL(source)
  if (ret.host === 'github.com') {
    ret.host = 'raw.githubusercontent.com'
  } else if (!ret.host.startsWith('raw.')) {
    ret.host = 'raw.' + ret.host
  }

  ret.pathname = ret.pathname.replace('blob/', '')

  return ret.toString()
}

module.exports = { whereFrom }
