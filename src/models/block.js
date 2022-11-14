import path from 'path'
import parseMarkdownFile from './../parsers/markdown.js'

/**
 *  Block
 *
 *  parsed markdown-file that can contains fields
 *  as yaml
 *
 *  @author Björn Hase <me@herr-hase.wtf>
 *  @license http://opensource.org/licenses/MIT The MIT License
 *  @link https://gitea.node001.net/HerrHase/happy-site-webpack-plugin.git
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

        this._content = parsedFile.content
        this._fields = parsedFile.fields
    }
}

export default Block