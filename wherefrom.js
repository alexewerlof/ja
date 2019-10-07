const { URL, URLSearchParams } = require('url')
/*
https://github.com/userpixel/micromustache/blob/master/.travis.yml
https://raw.githubusercontent.com/userpixel/micromustache/master/.travis.yml

https://github.schibsted.io/smp-distribution/hyperion/blob/f23f131ad35c90842be45c800b9fdeb11340537c/README.md
https://raw.github.schibsted.io/smp-distribution/hyperion/f23f131ad35c90842be45c800b9fdeb11340537c/README.md?token=AAAFT7YEWZSvsKoLQM4IkN9JoK-FFQGgks5do5RwwA%3D%3D

https://github.schibsted.io/smp-distribution/hyperion/blob/master/.prettierrc.js
https://raw.github.schibsted.io/smp-distribution/hyperion/master/.prettierrc.js?token=AAAFT5PwbVTxQdZuqa9xOCOE3NmLM2upks5do5VRwA%3D%3D

https://github.schibsted.io/smp-distribution/hyperion/blob/fix/sysla-missing-section/.gitignore
https://raw.github.schibsted.io/smp-distribution/hyperion/fix/sysla-missing-section/.gitignore?token=AAAFT7o5PGPj7jCuRN4xAv3Wphq3dFtwks5do5YtwA%3D%3D

https://github.schibsted.io/smp-distribution/hyperion/blob/fe7cefd03b3ffaf88c8c92ba74ad8ba43661cf73/src/sites/sysla/.env-dev
https://raw.github.schibsted.io/smp-distribution/hyperion/fe7cefd03b3ffaf88c8c92ba74ad8ba43661cf73/src/sites/sysla/.env-dev?token=AAAFT12FjlZdT74XxaaEmZZn48Nf5B_Xks5do5ZPwA%3D%3D
*/

function whereFrom(src, token) {
    const ret = new URL(src)
    if (ret.host === 'github.com') {
        ret.host = 'raw.githubusercontent.com'
    } else if (!ret.host.startsWith('raw.')) {
        ret.host = 'raw.' + ret.host
    }

    ret.pathname = ret.pathname.replace(/blob\//, '')

    if (token !== undefined) {
        const newSearchparams = new URLSearchParams(ret.search)
        newSearchparams.set('token', token)
        ret.search = newSearchparams.toString()
    }

    return ret.toString()
}

module.exports = { whereFrom }
