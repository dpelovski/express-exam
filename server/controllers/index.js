const home = require('./home-controller')
const users = require('./users-controller')
const tweets = require('./tweet-controller')
const admin = require('./admin-controller')

module.exports = {
  home: home,
  users: users,
  tweets: tweets,
  admin: admin
}
