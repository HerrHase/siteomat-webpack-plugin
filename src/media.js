const path = require('path')
const fs = require('fs')

const sharp = require('sharp')
const mkdirp = require('mkdirp')
const crypto = require('crypto')
const slugify = require('slugify')

const configStore = require('./config.js')

/**
 *
 *
 */
class Media {

    constructor() {
        this._DIR_ASSETS = '/assets/'
    }

    /**
     *
     *  @param  {string} srcPath
     *  @param  {object} sizes
     *  @param  {Object} [options={}]
     *  @return {string}
     *
     */
    async resize(src, sizes, options = {}) {

        this._extension = path.extname(src)
        this._filename = slugify(path.basename(src, this._extension))

        this._process = await sharp(configStore.get('source') + '/' + src)

        // resize without options and with options
        if (Object.getOwnPropertyNames(options).length === 0) {
            await this._process
                .resize(sizes)
        } else {
            this._process
                .resize(sizes, options)
        }

        // optimize
        this._optimize()

        const fileBuffer = await this._process
            .toBuffer()

        const relativeDestinationPath = this._DIR_ASSETS + this._resolveRelativeDestinationPath(fileBuffer)

        // create directories and write file
        mkdirp.sync(configStore.get('destination') + relativeDestinationPath)
        fs.writeFileSync(configStore.get('destination') + relativeDestinationPath + '/' + this._filename + this._extension, fileBuffer)

        return relativeDestinationPath + '/' + this._filename + this._extension
    }

    /**
     *  @TODO much nicer to add a hook system so behavior can be change
     *
     *
     *  @param  {string} extension
     *
     */
    _optimize() {
        if (this._extension === '.gif') {
            this._process
                .gif({
                    reoptimise: true
                })
        } else {

            // change extension
            this._extension = '.webp'
            this._process

                .webp({
                    lossless: true
                })
        }
    }

    /**
     *  resolve path to write file, hash will be get = fileBuffer and
     *
     *
     *  @param {object} fileBuffer
     *  @return {string}
     *
     */
    _resolveRelativeDestinationPath(fileBuffer) {
        const hash = crypto.createHash('sha1')
        hash.update(fileBuffer)

        return hash.digest('hex').match(new RegExp('.{1,8}', 'g')).join('/')
    }
}

module.exports =Media