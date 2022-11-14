import fs from 'fs'
import path from 'path'
import mkdirp from 'mkdirp'

import Engine from './engine.js'
import Sitemap from './sitemap.js'

import PagesQuery from './queries/pages.js'
import parseYamlFile from './parsers/yaml.js'

/**
 *
 *  @author Björn Hase <me@herr-hase.wtf>
 *  @license http://opensource.org/licenses/MIT The MIT License
 *  @link https://gitea.node001.net/HerrHase/happy-site-webpack-plugin.git
 *  
 */
class HappySite {

    /**
     *
     *
     *  @param  {string} source
     *  @param  {string} destination
     *
     */
    constructor(source, destination, views) {
        this._source = source
        this._destination = destination
        this._views = views

        // get config for site
        if (fs.existsSync(this._source + '/site.yml')) {
            const file = fs.readFileSync(this._source + '/site.yml', 'utf8')
            this._site = parseYamlFile(file)
        } else {
            throw new Error('site.yml not found in ' + this._source + '!')
        }

        this._engine = new Engine(views, this._site)
    }

    /**
     *  let it rain \o/
     *
     */
    run() {
        const query = new PagesQuery(this._source)
        const results = query.find()

        const sitemap = new Sitemap(this._site)

        // run through pages and generate html files
        results.forEach((page) => {
            const content = page.render(this._engine)

            // create directories and write file from page
            mkdirp(this._destination + page.pathname).then(() => {
                fs.writeFileSync(this._destination + page.pathname + '/' + page.filename, content)
            })

            sitemap.addPage(page)
        })

        // write sitemap
        fs.writeFileSync(this._destination + '/sitemap.xml', sitemap.getXmlAsString())
    }
}

export default HappySite