import nunjucks from 'nunjucks'
import { minify } from 'html-minifier'

import { asset, media } from './helpers/engine.js'

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
            throwOnUndefined: true
        }, options)

        this.nunjucks = nunjucks.configure(views, this._options)
        this.nunjucks.addFilter('media', function(options) {
            return media(options)
        })

        // adding defaults for view, function and data from config.yml
        this._defaults = {
            site: site,
            asset: asset
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
    render(view, data) {
        data = Object.assign({}, data, this._defaults)

        return minify(this.nunjucks.render(view, data), {
            removeComments: true,
            collapseWhitespace: true
        })
    }

}

export default Engine