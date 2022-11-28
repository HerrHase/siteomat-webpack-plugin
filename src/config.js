/**
 *  ConfigStore
 *
 *
 *
 *  @author Björn Hase <me@herr-hase.wtf>
 *  @license http://opensource.org/licenses/MIT The MIT License
 *  @link https://gitea.node001.net/HerrHase/siteomat-webpack-plugin.git
 *
 */
class ConfigStore {

    constructor() {
        if (!ConfigStore.instance) {
            ConfigStore.instance = this;
            this._data = {}
        }

        return ConfigStore.instance;
    }

    /**
     *  set value by key
     *
     *  @param {String} key
     *  @param {String|Object} value
     *
     */
    set(key, value) {
        this._data[key] = value
    }

    /**
     *  get value by key
     *
     *  @param  {String} key
     *  @return {String|Object}
     */
    get(key) {

        if (!this._data?.[key]) {
            throw new Error(key + ' not found in ConfigStore!')
        }

        return this._data[key]
    }
}

// create instance
const instance = new ConfigStore();

module.exports = instance