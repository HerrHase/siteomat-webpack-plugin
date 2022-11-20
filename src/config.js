/**
 *
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
     *
     */
    set(key, value) {
        this._data[key] = value
    }

    /**
     *
     *
     */
    get(key) {
        return this._data[key]
    }
}

// create instance
const instance = new ConfigStore();

module.exports =instance