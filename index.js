import { validate } from 'schema-utils'
import HappySite from './src/happySite.js'

// schema for options object
const schema = {
    type: 'object',
    properties: {
        source: {
            type: 'string'
        },
        destination: {
            type: 'string'
        },
        views: {
            type: 'string'
        }
    }
}

export default class HappySiteWebpackPlugin {
    constructor(options = {}) {
        validate(schema, options)

        this._options = options
    }

    apply(compiler) {

        const pluginName = HappySiteWebpackPlugin.name

        // webpack module instance can be accessed from the compiler object,
        // this ensures that correct version of the module is used
        // (do not require/import the webpack or any symbols from it directly).
        const { webpack } = compiler

        // Compilation object gives us reference to some useful constants.
        const { Compilation } = webpack

        // RawSource is one of the "sources" classes that should be used
        // to represent asset sources in compilation.
        const { RawSource } = webpack.sources

        compiler.hooks.thisCompilation.tap(pluginName, (compilation) => {

            // Tapping to the assets processing pipeline on a specific stage.
            compilation.hooks.processAssets.tap({
                name: pluginName,

                // Using one of the later asset processing stages to ensure
                // that all assets were already added to the compilation by other plugins.
                stage: Compilation.PROCESS_ASSETS_STAGE_SUMMARIZE
            },

            (assets) => {
                const happySite = new HappySite(this._options.source, this._options.destination, this._views)
            })
        })
    }
}

module.exports = { HappySiteWebpackPlugin }