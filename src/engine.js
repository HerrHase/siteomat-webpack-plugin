const nunjucks = require('nunjucks')
const { minify } = require('html-minifier')
const fs = require('fs')

const { asset, resize } = require('./helpers.js')
const PageQuery = require('./queries/pages.js')
const configStore = require('./config.js')

/**
 * engine - handle eta.js
 *
 *  @author Björn Hase <me@herr-hase.wtf>
 *  @license http://opensource.org/licenses/MIT The MIT License
 *  @link https://gitea.node001.net/HerrHase/happy-site-webpack-plugin.git
 *
 */
class Engine {

    constructor(views, site, options) {

        // merge options
        this._options = Object.assign({}, {
            autoescapes: true,
            throwOnUndefined: true,
            web: {
                async: true
            }
        }, options)

        this.nunjucks = nunjucks.configure(views, this._options)
        this.nunjucks.addFilter('resize', (...args) => {
            const done = args.pop()
            const options = args?.[2] ? {} : args[2]

            resize(args[0], args[1], options, done)
        }, true)

        // adding defaults for view, function and data = config.yml
        this._defaults = {
            site: site,
            asset: asset,
            pageQuery: new PageQuery(configStore.get('source'))
        }
    }

    /**
     *  render
     *
     *  @param  {string} view
     *  @param  {object} data
     *  @return {string}
     *
     */
    render(view, data, done) {
        data = Object.assign({}, data, this._defaults)

        this.nunjucks.render(view, data, (error, response) => {

            const options = configStore.get('options')

            if (options.minifyHtml === true) {
                response = minify(response, {
                    removeComments: true,
                    collapseWhitespace: true,
                    collapseInlineTagWhitespace: true
                })
            }

            done(error, response)
        })
    }

}

module.exports = Engine