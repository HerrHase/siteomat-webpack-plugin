const { assert } = require('chai')
const fs = require('fs')

describe('Blocks', function () {

	// get function parseMarkdownFile
	const BlocksQuery = require('./../src/queries/blocks.js')

	const blocksQuery = new BlocksQuery('./ressources')
	const results = blocksQuery.find()

	// check results
	it('block is array', function() {
      	assert.isArray(results.block)
    })

	it('block has length of 2', function() {
      	assert.equal(results.block.length, 2)
    })

	it('title in first block are equal', function() {
      	assert.equal(results.block[0].title, 'health goth DIY tattooed')
    })
})
