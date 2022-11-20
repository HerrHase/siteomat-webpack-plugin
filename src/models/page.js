import path from 'path'
import slugify from 'slugify'
import merge from 'lodash.merge'
import nunjucks from 'nunjucks'

import parseMarkdownFile from './../parsers/markdown.js'

/**
 *  Page
 *
 *
 *  @author Björn Hase <me@herr-hase.wtf>
 *  @license http://opensource.org/licenses/MIT The MIT License
 *  @link https://gitea.node001.net/HerrHase/happy-site-webpack-plugin.git
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
        this.filename = this._resolveFilename(file)
        this.pathname = this._resolvePathname(parent)

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
     *  render view of page
     *
     *
     *  @return {string}
     *
     */
    render(engine, done) {

        const page = Object.assign({}, this._fields)

        page.content = this._content
        page.blocks = this._blocks
        page.path = this.pathname + '/' + this.filename

        return engine.render(this._fields.view, {
            page: page
        }, done)
    }

    /**
     *  create html-filename from filename
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
     *  pathname from parent
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

export default Page