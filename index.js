const HappySite = require('./src/happySite.js')
const fs = require('fs')

class HappySiteWebpackPlugin {

    constructor(source, views, destination = null, options = {}) {
        this._options = {
            source: source,
            views: views,
            destination: destination,
            options: options
        }

        if (!fs.existsSync(source)) {
            throw new Error('source "' + source + '" not found!')
        }

        if (!fs.existsSync(views)) {
            throw new Error('views "' + views + '" not found!')
        }
    }

    apply(compiler) {

        const pluginName = HappySiteWebpackPlugin.name

        // webpack module instance can be accessed from the compiler object,
        // this ensures that correct version of the module is used
        // (do not require/import the webpack or any symbols from it directly).
        const { webpack } = compiler

        // Compilation object gives us reference to some useful constants.
        const { Compilation } = webpack

        compiler.hooks.done.tap(pluginName, ({ compilation }) => {

            // if destination is null, use from webpack configuration
            if (!this._options.destination) {
                this._options.destination = compilation.outputOptions.path
            }

            const happySite = new HappySite(this._options.source, this._options.views, this._options.destination, this._options.options)
            happySite.run()
        })
    }
}

module.exports = HappySiteWebpackPlugin