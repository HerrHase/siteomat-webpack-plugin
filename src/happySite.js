import fs from 'fs'
import path from 'path'
import mkdirp from 'mkdirp'

import Engine from './engine.js'
import Sitemap from './sitemap.js'

import PagesQuery from './queries/pages.js'
import parseYamlFile from './parsers/yaml.js'

import configStore from './config.js'

/**
 *  Main
 *
 *
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

        configStore.set('source', source)
        configStore.set('destination', destination)
        configStore.set('views', views)

        // get config for site
        if (fs.existsSync(this._source + '/site.yml')) {
            const file = fs.readFileSync(this._source + '/site.yml', 'utf8')
            this._site = parseYamlFile(file)
        } else {
            throw new Error('site.yml not found in ' + this._source + '!')
        }

        configStore.set('site', this._site)

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
            page.render(this._engine, (error, content) => {

                // show errors
                if (error) {
                    console.error(error)
                }

                // if no content show error message
                if (!content) {
                    console.error('Error! Rendering Page ' + '"' + page.filename + '" is null')
                    return;
                }

                // create directories and write file from page
                mkdirp(this._destination + page.pathname).then(() => {
                    fs.writeFileSync(this._destination + page.pathname + '/' + page.filename, content)
                })

                sitemap.addPage(page)
            })
        })

        // write sitemap
        fs.writeFileSync(this._destination + '/sitemap.xml', sitemap.getXmlAsString())
    }
}

export default HappySite