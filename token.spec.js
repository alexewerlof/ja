const { _test } = require('./token')

describe('sourceTokenName()', () => {
  const { sourceTokenName } = _test

  it.each([
    ['https://github.com/userpixel/micromustache', 'GITHUB_COM_TOKEN'],
    ['https://www.github.com/userpixel/micromustache', 'WWW_GITHUB_COM_TOKEN'],
    ['https://www.github.com:5050/userpixel/micromustache', 'WWW_GITHUB_COM_TOKEN'],
    ['https://github.company.io/userpixel/micromustache', 'GITHUB_COMPANY_IO_TOKEN'],
  ])('works correctly for %s', (source, envVarName) => {
    expect(sourceTokenName(source)).toBe(envVarName)
  })
})
