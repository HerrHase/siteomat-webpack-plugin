const HappySite = require('./src/happySite.js')

class HappySiteWebpackPlugin {

    constructor(source, views) {
        this._options = {
            source: source,
            views: views
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

        // RawSource is one of the "sources" classes that should be used
        // to represent asset sources in compilation.
        const { RawSource } = webpack.sources

        compiler.hooks.thisCompilation.tap(pluginName, (compilation) => {

            const compilationHash = compilation.hash
            const webpackPublicPath = '.' + compilation.getAssetPath(compilation.outputOptions.publicPath, { hash: compilationHash })

            // Tapping to the assets processing pipeline on a specific stage.
            compilation.hooks.processAssets.tap({
                name: pluginName,

                // Using one of the later asset processing stages to ensure
                // that all assets were already added to the compilation by other plugins.
                stage: Compilation.PROCESS_ASSETS_STAGE_SUMMARIZE
            },

            (assets) => {
                const happySite = new HappySite(webpackPublicPath + this._options.source, this._options.views, webpackPublicPath)
                happySite.run()
            })
        })
    }
}

module.exports = HappySiteWebpackPlugin