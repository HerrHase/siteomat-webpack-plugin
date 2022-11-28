const path = require('path')
const fs = require('fs')

const Media = require('./../factories/media.js')

/**
 *  asset - checks manifest.json for given path and return
 *  file path with id for cache busting
 *
 *
 *  @param {String} publicPath
 *
 */

function asset(staticPath) {

    // getting basePath
    let result = staticPath

    // path to mix-manifest
    const file = path.join(path.resolve()) + 'mix-manifest.json'

    if (fs.existsSync(file)) {

        const manifest = fs.readFileSync(file)
        const files = JSON.parse(manifest)

        if (files[staticPath]) {
            result = files[staticPath]
        }
    }

    return result
}

/**
 *  asset - checks manifest.json for given path and return
 *  file path with id for cache busting
 *
 *
 *  @param {String} publicPath
 *
 */

async function resize(src, sizes, options, done)
{
    const media = new Media()

    src = await media.resize(src, sizes, options)
    done(null, src)
}

module.exports = { asset, resize }