const { _test: { validateSource, validateLocalFilePath } } = require('./config.js')

describe('config.js', () => {
    describe('validateSource()', () => {
        it('returns the source if it is valid', () => {
            const source = 'http://server.com/path/to/file'
            expect(validateSource(source)).toEqual(source)
        })
    })

    describe('validateLocalFilePath()', () => {
        it('returns the source if it is valid', () => {
            const localFilePath = 'path/to/file'
            expect(validateLocalFilePath(localFilePath)).toEqual(localFilePath)
        })
    })
})