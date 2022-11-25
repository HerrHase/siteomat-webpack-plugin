const HappySite = require('./src/happySite.js')

const happySite = new HappySite('./resources/site', './resources/views', './public')
happySite.run()