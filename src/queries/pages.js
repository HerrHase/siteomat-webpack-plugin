const fs = require('fs')
const path = require('path')

const Page = require('./../models/page.js')
const Blocks = require('./../queries/blocks.js')

/**
 *  Pages - search, filter and find pages
 *
 *  @author Björn Hase <me@herr-hase.wtf>
 *  @license http://opensource.org/licenses/MIT The MIT License
 *  @link https://gitea.node001.net/HerrHase/happy-site-webpack-plugin.git
 *
 */

class Pages {

    /**
     *
     *
     *  @param {string} dirPath
     *
     */
    constructor(dirPath) {

        // constants
        this.FILE_EXTENSION = '.md'
        this.FILE_INDEX = 'index'
        this.DIRECTORY_BLOCKS = '_blocks'

        // default options for find
        this._options = {
            parent: '',
            deep: -1
        }

        this._dirPath = dirPath
        this._results = []
    }

    /**
     *  find pages
     *
     *  @param  {Object} [options={}]
     *  @return {array}
     *
     */
    find(options = {}) {
        this._results = []

        options = Object.assign({}, this._options, options)
        this._findFiles(this._dirPath, options)

        return this._results
    }

    /**
     *  find files
     *
     *  @param  {[type]} dirPath                       [description]
     *  @param  {Object} [parameters={}]               [description]
     *  @param  {Object} [options={}]                  [description]
     *  @return {[type]}
     *
     */
    _findFiles(dirPath, options) {

        //
        const files = fs.readdirSync(dirPath + options.parent, {
            withFileTypes: true
        })

        files.forEach((file) => {

            // skip for file that is not markdown
            if (file.isFile() && path.extname(file.name) !== this.FILE_EXTENSION ) {
                return;
            }

            // skip for file that is index but not root
            if (file.isFile() && file.name === (this.FILE_INDEX + this.FILE_EXTENSION) && options.parent !== '') {
                return;
            }

            // skip for directory that contains partials
            if (file.isDirectory() && file.name === this.DIRECTORY_BLOCKS) {
                return;
            }

            // if directory going deep
            if (file.isDirectory() && (options.deep > 0 || options.deep === -1)) {

                if (options.deep > 0) {
                    options.deep--
                }

                const childrenOptions = Object.assign({}, options, {
                    'parent': options.parent + '/' + file.name
                })

                this._findFiles(dirPath, childrenOptions)
            }

            // get file
            const content = this._getFile(file, dirPath + options.parent)

            // skip if empty
            if (!content) {
                return;
            }

            // check if
            const blocks = this._getBlocks(dirPath + options.parent + '/' + file.name)

            // create page object and add to page
            const page = new Page(file, options.parent, content, blocks)
            this._results.push(page)
        })
    }

    /**
     *
     *
     *  @param  {string} dirPath
     *  @return {array}
     *
     */
    _getBlocks(dirPath) {
        const blocksQuery = new Blocks(dirPath)
        return blocksQuery.find()
    }

    /**
     *  get file content
     *
     *  @param  {string} slug
     *  @param  {string} sourcePath
     *  @return {mixed}
     *
     */
    _getFile(file, dirPath) {

        // file
        let result = null

        // path of file, first try with slug
        let filePath = dirPath + '/' + file.name

        if (fs.existsSync(filePath) && file.isFile()) {
            result = fs.readFileSync(filePath, 'utf8')
        } else {
            filePath = dirPath + '/' + file.name + '/' + this.FILE_INDEX + this.FILE_EXTENSION

            if (fs.existsSync(filePath)) {
                result = fs.readFileSync(filePath, 'utf8')
            }
        }

		return result
	}

}

module.exports =Pages