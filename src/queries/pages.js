const fs = require('fs')
const path = require('path')
const orderBy = require('lodash.orderby')

const PageFactory = require('./../factories/page.js')
const BlocksQuery = require('./../queries/blocks.js')

/**
 *  Pages - search, filter and find pages
 *
 *  @author Björn Hase <me@herr-hase.wtf>
 *  @license http://opensource.org/licenses/MIT The MIT License
 *  @link https://gitea.node001.net/HerrHase/siteomat-webpack-plugin.git
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
        this._count = 0

        options = Object.assign({}, this._options, options)
        this._findFiles(this._dirPath, options)

        //
        if (options.orderBy && options.orderBy.length > 0) {
            this._orderBy(options)
        }

        return this._results
    }

    /**
     *  filtering single results from query
     *  if filter is set check result
     *
     *  @param  {array} result
     *  @param  {array} options
     *  @return {boolean}
     *
     */
    _filter(result, options) {

        let isValid = true

        for (const [key, value] of Object.entries(options.filter)) {

            // equal
            if (value['_eq'] && result[key] !== value['_eq']) {
                isValid = false
            }

            // not equal
            if (value['_neq'] && result[key] === value['_neq']) {
                isValid = false
            }

            // in
            if (value['_in'] && Array.isArray(value['_in'])) {

				// if result no exists
				if (!result[key]) {
					isValid = false
				}

                if (Array.isArray(result[key])) {

					let found = false

                  	result[key].forEach((v, index) => {
						if (value['_in'].indexOf(v) !== -1) {
							found = true
						}
                  	})

					if (!found) {
						isValid = false
					}

                } else {
					if (value['_in'].indexOf(result[key]) === -1) {
						isValid = false
					}
                }
            }

            if (value['_lt'] && result[key] < value['_lt']) {
                isValid = false
            }

            if (value['_lte'] && result[key] <= value['_lte']) {
                isValid = false
            }

            if (value['_gt'] && result[key] > value['_gt']) {
                isValid = false
            }

            if (value['_gte'] && result[key] >= value['_gte']) {
                isValid = false
            }

            if (value['_null'] && result[key]) {
                isValid = false
            }

            if (value['_nnull'] && !result[key]) {
                isValid = false
            }
        }

        return isValid
    }

    /**
     *
     *
     *  @param  {array} options
     *
     */
    _orderBy(options) {
        options.orderBy.forEach((key, index) => {

            let direction = 'asc'

            if (key.charAt(0) === '-') {
                key.slice(0, 1)
                direction = 'desc'
            }

            this._results = orderBy(this._results, key, direction)
        })
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

        // getting all files
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
            const page = new PageFactory(file, options.parent, content, blocks)

            // check for filters and skip
            if (options.filter && !this._filter(page.get(), options)) {
                return;
            }

            // check for filters and skip
            if (options.limit && options.limit <= this._results.length) {
                return;
            }

            this._results.push(page.get())
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
        const blocksQuery = new BlocksQuery(dirPath)
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

module.exports = Pages
