const {
  _test: { validateSource, validateLocalFilePath, parseConfigLine },
} = require('./config.js')

describe('config.js', () => {
  describe('validateSource()', () => {
    it('returns the source if it is valid', () => {
      const source = 'http://server.com/path/to/file'
      expect(validateSource(source)).toEqual(source)
    })

    it('throws if the source cannot be parsed as a URL', () => {
      expect(() => validateSource('//server.com/path/to/file')).toThrow()
    })

    it('throws if the source misses the path name', () => {
      expect(() => validateSource('https://server.com')).toThrow()
      expect(() => validateSource('https://server.com/')).toThrow()
    })
  })

  describe('validateLocalFilePath()', () => {
    it('returns the local file path if it is a valid file name', () => {
      const localFilePath = 'file'
      expect(validateLocalFilePath(localFilePath)).toEqual(localFilePath)
    })

    it('returns the local file path even if it has a valid directory', () => {
      const localFilePath = 'path/to/file'
      expect(validateLocalFilePath(localFilePath)).toEqual(localFilePath)
    })

    it('throws if the local file path is empty', () => {
      expect(() => validateLocalFilePath('')).toThrow()
    })

    it('throws if the local file path points to a directory', () => {
      expect(() => validateLocalFilePath('some/dir/')).toThrow()
    })

    it('throws if the local file path is absolute', () => {
      expect(() => validateLocalFilePath('/file')).toThrow()
      expect(() => validateLocalFilePath('/dir/file')).toThrow()
    })

    it('throws if the local file path points to a directory outside the current one', () => {
      expect(() => validateLocalFilePath('../../../some/dir/')).toThrow()
    })
  })

  describe('parseConfigLine()', () => {
    it('returns the source if it is valid', () => {
      expect(parseConfigLine('http://server.com/path/to/elephant > somefile')).toEqual({
        source: 'http://server.com/path/to/elephant',
        localFilePath: 'somefile',
      })
    })

    it('deduces the file name form the source', () => {
      expect(parseConfigLine('http://server.com/path/to/tiger')).toEqual({
        source: 'http://server.com/path/to/tiger',
        localFilePath: 'tiger',
      })
    })

    it('throws if it cannot parse the source as a valid URL', () => {
      expect(() => parseConfigLine('http://server.com/path/to/lion somefile')).toThrow()
    })

    it('throws if the separator is misplaced', () => {
      expect(() => parseConfigLine('http://server.com/path/to/zebra somefile >')).toThrow()
      expect(() => parseConfigLine('> http://server.com/path/to/mouse somefile')).toThrow()
    })

    it('throws if the separator is repeated', () => {
      expect(() =>
        parseConfigLine('http://server.com/path/to/cat > somefile > someOtherFile')
      ).toThrow()
      expect(() => parseConfigLine('http://server.com/path/to/dog >> somefile')).toThrow()
    })
  })
})
