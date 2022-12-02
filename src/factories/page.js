const path = require('path')
const slugify = require('slugify')
const merge = require('lodash.merge')
const nunjucks = require('nunjucks')
const assign = require('assign-deep')

const parseMarkdownFile = require('./../parsers/markdown.js')

/**
 *  Page
 *
 *
 *  @author Björn Hase <me@herr-hase.wtf>
 *  @license http://opensource.org/licenses/MIT The MIT License
 *  @link https://gitea.node001.net/HerrHase/siteomat-webpack-plugin.git
 *
 */

class Page {

    /**
     *
     *
     *  @param {object} file
     *  @param {string} parent
     *  @param {string} fileString
     *  @param {object} [blocks=null]
     *
     */
    constructor(file, parent, fileString, blocks = {}) {

        // parse file
        const result = parseMarkdownFile(fileString)

        // adding filename for html as pathname and relative path in structure
        this._filename = this._resolveFilename(file)
        this._pathname = this._resolvePathname(parent)

        // fields merge by default values
        this._fields = merge({
            view: 'page',
            meta: {
                robots: 'index'
            }
        }, result.fields)

        this._content = result.content
        this._blocks = blocks
    }

    /**
     *  create Page Object
     *
     *
     *  @return {object}
     *
     */
    get() {
        return assign({
            'content'  : this._content,
            'blocks'   : this._blocks,
            'path'     : this._pathname + '/' + this._filename,
            'filename' : this._filename,
            'pathname' : this._pathname

        }, this._fields)
    }

    /**
     *  create html-filename = filename
     *
     *  @param  {string} file
     *  @return {string}
     *
     */
    _resolveFilename(file) {

        let filename = file.name

        if (filename === 'index.md') {
            filename = 'index'
        } else {
            if (path.extname(filename) === '.md') {
                filename = filename.replace('.md', '')
            }

            filename = slugify(filename)
        }

        return filename + '.html'
    }

    /**
     *  pathname = parent
     *
     *  @param  {string} parent
     *  @return {string}
     *
     */
    _resolvePathname(parent) {
        let pathname = parent

        if (parent === '/') {
            pathname = ''
        }

        return pathname
    }
}

module.exports = Page