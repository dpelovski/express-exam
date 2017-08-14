const mongoose = require('mongoose')
const User = require('../data/User')

mongoose.Promise = global.Promise

require('../data/Tweet')
require('../data/Tag')
require('../data/Handle')

module.exports = (settings) => {
  mongoose.connect(settings.db)
  let db = mongoose.connection

  db.once('open', err => {
    if (err) {
      throw err
    }

    console.log('MongoDB ready!')

    User.seedAdminUser()
  })

  db.on('error', err => console.log(`Database error: ${err}`))
}
