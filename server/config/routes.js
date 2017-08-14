const controllers = require('../controllers')
const auth = require('./auth')

module.exports = (app) => {
  app.get('/', controllers.home.index)

  app.get('/users/register', controllers.users.registerGet)
  app.post('/users/register', controllers.users.registerPost)
  app.get('/users/login', controllers.users.loginGet)
  app.post('/users/login', controllers.users.loginPost)
  app.post('/users/logout', controllers.users.logout)

  app.get('/tweet', auth.isAuthenticated, controllers.tweets.getTweet)
  app.post('/tweet', auth.isAuthenticated, controllers.tweets.postTweet)

  app.get('/tag/:tagName', controllers.tweets.tagNameGet)

  app.get('/profile/:username', auth.isAuthenticated, controllers.users.getProfile)

  app.post('/delete/:tweetId', auth.isInRole('Admin'), controllers.admin.deleteTweet)

  app.get('/edit/:tweetId', auth.isInRole('Admin'), controllers.admin.editTweetGet)
  app.post('/edit/:tweetId', auth.isInRole('Admin'), controllers.admin.editTweetPost)

  app.get('/admin/all', auth.isInRole('Admin'), controllers.admin.adminGet)

  app.post('/admin/add/:userId', auth.isInRole('Admin'), controllers.admin.adminGrandPost)

  app.all('*', (req, res) => {
    res.status(404)
    res.send('404 Not Found!')
    res.end()
  })
}
