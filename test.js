import HappySite from './src/happySite.js'

const happySite = new HappySite('./resources/site', './public', './resources/views')
happySite.run()