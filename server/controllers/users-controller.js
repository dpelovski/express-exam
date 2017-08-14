const encryption = require('../utilities/encryption')
const User = require('mongoose').model('User')
let Tweet = require('mongoose').model('Tweet')
let Handle = require('mongoose').model('Handle')

module.exports = {
  registerGet: (req, res) => {
    res.render('users/register')
  },
  registerPost: (req, res) => {
    let reqUser = req.body
    // Add validations!

    let salt = encryption.generateSalt()
    let hashedPassword = encryption.generateHashedPassword(salt, reqUser.password)

    User.create({
      username: reqUser.username,
      firstName: reqUser.firstName,
      lastName: reqUser.lastName,
      salt: salt,
      hashedPass: hashedPassword
    }).then(user => {
      req.logIn(user, (err, user) => {
        if (err) {
          res.locals.globalError = err
          res.render('users/register', user)
        }

        res.redirect('/')
      })
    })
  },
  loginGet: (req, res) => {
    res.render('users/login')
  },
  loginPost: (req, res) => {
    let reqUser = req.body
    User
      .findOne({ username: reqUser.username }).then(user => {
        if (!user) {
          res.locals.globalError = 'Invalid user data'
          res.render('users/login')
          return
        }

        if (!user.authenticate(reqUser.password)) {
          res.locals.globalError = 'Invalid user data'
          res.render('users/login')
          return
        }

        req.logIn(user, (err, user) => {
          if (err) {
            res.locals.globalError = err
            res.render('users/login')
          }

          res.redirect('/')
        })
      })
  },
  logout: (req, res) => {
    req.logout()
    res.redirect('/')
  },
  getProfile: (req, res) => {

    let userId = req.user.id

    Tweet.find({}).sort('-createdOn').limit(100).then((tweets) => {
      let userTweets = []
      for(let tweet of tweets) {
        if(tweet.createdBy.toString() == userId.toString()) {
          userTweets.push(tweet)
        }
      }

        Handle.find({}).populate('tweets').then((handles) => {
          let allHandles = []
          let allTwits = []
          for(let handle of handles) {
            let handleName = handle.name.substr(1)

              if(handleName.toString() == req.user.username.toString()){
                allHandles.push(handle)
                for(let tweet of handle.tweets){
                  allTwits.push(tweet)
                }
              }
          }
          res.render('users/profile', {
            tweets: userTweets,
            handles: allHandles,
            allTwits: allTwits
          })

        })
    })
  }
}
