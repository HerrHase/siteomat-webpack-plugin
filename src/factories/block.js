const path = require('path')
const parseMarkdownFile = require('./../parsers/markdown.js')

const assign = require('assign-deep')

/**
 *  Block
 *
 *  parsed markdown-file that can
 *  contains fields as yaml
 *
 *  @author Björn Hase <me@herr-hase.wtf>
 *  @license http://opensource.org/licenses/MIT The MIT License
 *  @link https://gitea.node001.net/HerrHase/siteomat-webpack-plugin.git
 *
 */

class Block {

    /**
     *
     *
     *  @param {string} fileString
     *
     */
    constructor(fileString) {

        // parse string of file
        const parsedFile = parseMarkdownFile(fileString)

        // getting parsed data
        this._content = parsedFile.content
        this._fields = parsedFile.fields
    }

    /**
     *
     *
     *  @return {object}
     *
     */
    get() {
        return assign({
            'content': this._content
        }, this._fields)
    }
}

module.exports = Block