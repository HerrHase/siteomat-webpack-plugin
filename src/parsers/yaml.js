const yaml = require('js-yaml')

/**
 *  parse string of file and only parse yaml
 *
 *  @author Björn Hase <me@herr-hase.wtf>
 *  @license http://opensource.org/licenses/MIT The MIT License
 *  @link https://gitea.node001.net/HerrHase/happy-site-webpack-plugin.git
 *
 */

function parseYamlFile(file) {

    let config

    try {
        config = yaml.load(file)
    } catch (error) {
        throw new Error('parseYamlFile: Yaml has errors!')
    }

    return config
}

module.exports = parseYamlFile