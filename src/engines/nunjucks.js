const nunjucks = require('nunjucks')
const { minify } = require('html-minifier')
const fs = require('fs')
const assign = require('assign-deep')

const configStore = require('./../config.js')
const { asset, resize } = require('./helpers.js')
const PageQuery = require('./../queries/pages.js')

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
            throwOnUndefined: true,
            web: {
                async: true
            }
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

        // merge data
        data = assign({}, data, this._defaults)

        this.nunjucks.render(view, data, (error, response) => {

            const options = configStore.get('options')

            // if options minifyHtml is set, minify html
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