const mongoose = require('mongoose')
let Tweet = mongoose.model('Tweet')
let User = mongoose.model('User')
let Tag = mongoose.model('Tag')

function createTag(tagName) {
    return new Promise((resolve, reject) => {
        Tag.findOne({name: tagName}).then((tagFromDb) => {

            if (tagFromDb){
                resolve(tagFromDb._id)
                return
            } 
            
            Tag.create({name: tagName}).then((tag)=> {
                resolve(tag._id)
            })

        })
    })
}

module.exports = {
  deleteTweet: (req, res) => {
      let tweetId = req.params.tweetId

      Tweet.deleteOne({_id: tweetId}).then(() => {
          res.redirect('back')
      })
  },
  editTweetGet: (req, res) => {
    let tweetId = req.params.tweetId

    Tweet.findById(tweetId).then((tweet) => {
        res.render('tweet/edit', {
            tweet: tweet
        })
    })
  },
  editTweetPost: (req, res) => {
    let message = req.body.message
    let tweetId = req.params.tweetId
    let userId = req.user._id
    
    let tokens =  message.toLowerCase().match(/([@#])([a-z\d_]+)/ig)

    let hashtags = []
    
    for (let tagName of tokens) {
        hashtags.push(createTag(tagName))
    }
    
    Promise.all(hashtags).then(() => {

        Tweet.findById(tweetId).then((tweet) => {
            tweet.message = message
            tweet.save()

            res.redirect('/')
        })
    })
    

  },
  adminGet: (req, res) => {

    User.find({}).then((users) => {

        let nonAdminUsers = []

        for (let user of users) {
            if(!(user.roles.indexOf('Admin') > -1)) {
                 nonAdminUsers.push(user)
            }            
        }

        res.render('admin/all', {
            users: nonAdminUsers
        })
    })
  },
  adminGrandPost: (req, res) => {
      let userId = req.params.userId

      User.findById(userId).then((user) => {
          user.roles = []
          user.roles.push('Admin')

          user.save()
          res.redirect('back')
      })  
  }
}
