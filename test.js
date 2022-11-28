const Siteomat = require('./src/siteomat.js')

const siteomat = new Siteomat('./example/site', './example/views', './public')
siteomat.run()