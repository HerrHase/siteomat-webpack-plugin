import fs from 'fs'
import path from 'path'

import Block from './../models/block.js'

/**
 *  search, filter and find pages
 *
 *  @author Björn Hase <me@herr-hase.wtf>
 *  @license http://opensource.org/licenses/MIT The MIT License
 *  @link https://gitea.node001.net/HerrHase/happy-site-webpack-plugin.git
 *  
 */

class Blocks {

    /**
     *
     *
     *  @param {string} dirPath
     *
     */
    constructor(dirPath) {

        this.DIRECTORY_BLOCKS = '_blocks'

        this._dirPath = dirPath + '/' + this.DIRECTORY_BLOCKS;
        this._results = {}
    }

    /**
     *
     *
     *  @return {array}
     */
    find() {

        if (fs.existsSync(this._dirPath)) {
            this._findFiles(this._dirPath)
        }

        return this._results
    }

    /**
     *  find files
     *
     *  @param  {[type]} dirPath
     *  @param  {Object} [parent = '']
     *
     */
    _findFiles(dirPath, parent = '') {

        //
        const files = fs.readdirSync(dirPath, {
            withFileTypes: true
        })

        files.forEach((file) => {

            // skip for file that is not markdown
            if (file.isFile() && path.extname(file.name) !== '.md') {
                return;
            }

            // if directory going deep
            if (file.isDirectory()) {
                this._findFiles(dirPath, parent + '/' + file.name)
            }

            // get file
            const fileString = this._getFile(file, dirPath + parent)

            // skip if empty
            if (!fileString) {
                return;
            }

            // create page object and add to page
            const block = new Block(fileString)
            const blockname = this._parseBlockname(file.name)

            if (!this._results[blockname]) {
                this._results[blockname] = []
            }

            this._results[blockname].push({
                fields: block._fields,
                content: block._content
            })
        })
    }

    /**
     *  remove '.md' and also ordering number from filename
     *
     *  @param  {string} filename
     *  @return {string}
     *
     */
    _parseBlockname(filename) {
        const regex = new RegExp(/[-_]?[0-9]*\b.md\b$/)
        return filename.replace(regex, '')
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
        }

		return result
	}

}

export default Blocks