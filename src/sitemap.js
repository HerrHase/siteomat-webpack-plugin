import { XMLParser, XMLBuilder, XMLValidator} from 'fast-xml-parser'
import dayjs from 'dayjs'

/**
 *
 *
 *  @author Björn Hase <me@herr-hase.wtf>
 *  @license http://opensource.org/licenses/MIT The MIT License
 *  @link https://gitea.node001.net/HerrHase/happy-site-webpack-plugin.git
 *  
 */
class Sitemap {

    /**
     *
     *
     *  @param {[type]} site
     *  @param {[type]} pages
     *
     */
    constructor(site) {
        this._site = site
        this._urls = []
    }

    /**
     *  adding page to urls of sitemap, check if page is valid for sitemap
     *
     *  @param {object} page
     *
     */
    addPage(page) {
        if (this._isValid(page)) {
            this._urls.push({
                loc: 'https://' + this._site.domain + page.pathname + '/' + page.filename,
                lastmod: dayjs().format()
            })
        }
    }

    /**
     *  get xml as string
     *
     *  @return {string}
     *
     */
    getXmlAsString() {
        return this._createXml(this._urls)
    }

    /**
     *  check if robots has a noindex
     *
     *  @param  {object} page
     *  @return {boolean}
     *
     */
    _isValid(page) {

        let result = true

        if (page.meta) {
            page.meta.forEach((meta) => {
                if (meta['name'] === 'robots' && meta['content'].includes('noindex')) {
                    result = false
                    return;
                }
            })
        }

        return result
    }

    /**
     *  create xml with urls and return it as string
     *
     *  @param  {object} urls
     *  @return {string}
     *
     */
    _createXml(urls) {

        // builder for XML
        const builder = new XMLBuilder({
            format: true,
            processEntities: false,
            ignoreAttributes: false,
            attributeNamePrefix: '@'
        })

        const xmlString = builder.build({
            '?xml': {
                '@version': '1.0',
                '@encoding': 'UTF-8'
            },
            'urlset': {
                '@xmlns': 'http://www.sitemaps.org/schemas/sitemap/0.9',
                'url': urls
            }
        })

        return xmlString
    }
}

export default Sitemap