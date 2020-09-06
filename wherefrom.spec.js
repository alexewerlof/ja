const { whereFrom } = require('./wherefrom.js')

describe('whereFrom()', () => {
  it('can handle a usual github link', () => {
    expect(whereFrom('https://github.com/user-or-org/repo-name/blob/master/path/to/file')).toEqual(
      'https://raw.githubusercontent.com/user-or-org/repo-name/master/path/to/file'
    )
  })

  it('works for GHE', () => {
    expect(
      whereFrom(
        'https://github.custom-domain.example/user-or-org/repo-name/blob/master/path/to/file'
      )
    ).toEqual('https://raw.github.custom-domain.example/user-or-org/repo-name/master/path/to/file')
  })

  it('works for GHE with branch name', () => {
    expect(
      whereFrom(
        'https://github.custom-domain.example/user-or-org/repo-name/blob/branch-name/path/to/file'
      )
    ).toEqual(
      'https://raw.github.custom-domain.example/user-or-org/repo-name/branch-name/path/to/file'
    )
  })

  it('works for GHE with hash', () => {
    expect(
      whereFrom(
        'https://github.custom-domain.example/user-or-org/repo-name/blob/f23f131ad35c90842be45c800b9fdeb1134tbc/path/to/file'
      )
    ).toEqual(
      'https://raw.github.custom-domain.example/user-or-org/repo-name/f23f131ad35c90842be45c800b9fdeb1134tbc/path/to/file'
    )
  })

  // it('can handle a usual gitlab link', () => {
  //     expect(whereFrom(
  //         'https://gitlab.com/user-or-org/repo-name/blob/master/README.md'
  //     )).toEqual(
  //         'https://gitlab.com/user-or-org/repo-name/raw/master/README.md'
  //     )
  // })
})
