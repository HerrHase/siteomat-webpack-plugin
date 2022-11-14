import { validate } from 'schema-utils'

// schema for options object
const schema = {
    type: 'object',
    properties: {
        test: {
            type: 'string',
        }
    }
}

export default class HappySiteWebpackPlugin {
    constructor(options = {}) {
        validate(schema, options, {
            name: 'Hello World Plugin',
            baseDataPath: 'options',
        })
    }

    apply(compiler) {
        
    }
}