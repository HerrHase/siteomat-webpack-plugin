const nunjucks = require('nunjucks')
const fs = require('fs')
const assign = require('assign-deep')
const { minify } = require('html-minifier')

const configStore = require('./../config.js')
const { asset, resize } = require('./helpers.js')
const PageQuery = require('./../queries/pages.js')
const dayjs = require('dayjs')

/**
 *  nunjucks
 *
 *
 *  @author Björn Hase <me@herr-hase.wtf>
 *  @license http://opensource.org/licenses/MIT The MIT License
 *  @link https://gitea.node001.net/HerrHase/siteomat-webpack-plugin.git
 *
 */
class Engine {

    /**
     *
     *
     *  @param {string} views
     *  @param {object} site
     *  @param {object} options
     *
     */
    constructor(views, site, options) {

        // merge data
        this._options = assign({}, {
            autoescapes: true,
            throwOnUndefined: true
        }, options)

        this.nunjucks = nunjucks.configure(views, this._options)

        // add filter: resize
        this.nunjucks.addFilter('resize', (...args) => {
            const done = args.pop()
            const options = args?.[2] ? {} : args[2]

            resize(args[0], args[1], options, done)
        }, true)

        // adding defaults for view, data from site.yml, functions and pageQuery
        this._defaults = {
            site: site,
            asset: asset,
            dayjs: dayjs,
            pageQuery: new PageQuery(configStore.get('source'))
        }
    }

    /**
     *  render
     *
     *  @param  {object} page
     *  @param  {function} done
     *
     */
    render(page, done) {

        // merge data
        const data = assign({
            page: page
        }, this._defaults)

        this.nunjucks.render(data.page.view, data, (error, response) => {

            if (error) {
                console.error(error)
            }

            const options = configStore.get('options')

            // if options minifyHtml is set, minify html, but only if page has type html
            if (options.minifyHtml === true && data.page.type === 'html') {
                response = minify(response, {
                    removeComments: true,
                    collapseWhitespace: true,
                    keepClosingSlash: true,
                    removeOptionalTags: false
                })

            // remove empty lines
            } else {
                response = response.replace(/^(?:[\t ]*(?:\r?\n|\r))+/gm, '')
            }

            done(error, response)
        })
    }

}

module.exports = Engine