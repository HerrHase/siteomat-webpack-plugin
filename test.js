const HappySite = require('./src/happySite.js')

const happySite = new HappySite('./example/site', './example/views', './public')
happySite.run()