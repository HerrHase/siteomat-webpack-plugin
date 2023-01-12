const { assert } = require('chai')
const fs = require('fs')

describe('Parser Markdown', function () {

	// default file
	const markdownData = fs.readFileSync('./ressources/default.md', 'utf8')

	// get function parseMarkdownFile
	const parseMarkdownFile = require('./../src/parsers/markdown.js')

	// start parsing
	const result = parseMarkdownFile(markdownData)

	// check results
	it('fields exists', function() {
      	assert.notEqual(result.fields, undefined)
    })

	it('fields is object', function() {
		assert.isObject(result.fields)
    })

	it('fields are valid', function() {
		assert.deepEqual(result.fields, {
			title: 'health goth DIY tattooed',
			view: 'page.njk',
			meta: {
		    	description: 'DSA yes plz hot chicken green juice'
			}
		})
    })

	it('content exists', function() {
      	assert.notEqual(result.content, '')
    })

	it('content has html', function() {
      	assert.match(result.content, /<h2 id="normcore-cold-pressed-ramps-dsa">Normcore cold-pressed ramps DSA<\/h2>/)
    })
})
