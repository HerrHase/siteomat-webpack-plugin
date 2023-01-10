const Siteomat = require('./src/siteomat.js')

const siteomat = new Siteomat('./example/site', './example/views', {
    'destination': './public',
    'minifyHtml': true
})

siteomat.run()