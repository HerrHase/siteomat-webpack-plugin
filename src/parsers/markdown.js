import yaml from 'js-yaml'
import { marked } from 'marked'

/**
 *  parse string of file, parse yaml and parse markdown
 *
 *  @author Björn Hase <me@herr-hase.wtf>
 *  @license http://opensource.org/licenses/MIT The MIT License
 *  @link https://gitea.node001.net/HerrHase/happy-site-webpack-plugin.git
 *
 */

function parseMarkdownFile(fileString) {

    // regex get yaml section and markdown
    // thanks to, https://github.com/getgrav/grav
    const regex = new RegExp(/^(---\n(.+?)\n---){0,}(.*)$/gs)
    const matches = regex.exec(fileString)

    const result = {
        fields: undefined,
        content: ''
    }

    // check if yaml section not exists throw error
    if (matches?.[2]) {
        try {
            result.fields = yaml.load(matches[2])
        } catch (error) {
            throw new Error('Yaml has errors!')
        }
    }

    // if markdown section exits parse it to html 6565
    if (matches?.[3]) {
        result.content = marked.parse(matches[3])
    }

    return result
}

export default parseMarkdownFile