const mongoose = require('mongoose')
let Tweet = mongoose.model('Tweet')
let User = mongoose.model('User')
let Tag = mongoose.model('Tag')
let Handle = mongoose.model('Handle')

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

function createHandle(handleName) {
    return new Promise((resolve, reject) => {
        Handle.findOne({name: handleName}).then((handleFromDb) => {

            if (handleFromDb){
                resolve(handleFromDb._id)
                return
            } 
            
            Handle.create({name: handleName}).then((handle)=> {
                resolve(handle._id)
            })

        })
    })
}

module.exports = {
  getTweet: (req, res) => {
    res.render('tweet/tweet')
  },
  postTweet: (req, res) => {
    let message = req.body.message
    let userId = req.user.id

    if(message.length > 140) {
        res.locals.globalError = 'Tweet cannot exceed 140 symbols'
        res.render('tweet/tweet')
        return
    }
    
    let tokens =  message.toLowerCase().match(/([@#])([a-z\d_]+)/ig)

    let hashtags = []
    let handles = []
    let handleNames = []
    
    for (let tagName of tokens) {
        if(tagName[0] == "#") {
            hashtags.push(createTag(tagName))
        } else {
            handles.push(createHandle(tagName))
            handleNames.push(tagName)
        }

        
    }
    
    Promise.all(hashtags, handles).then(() => {

        Tag.find({name: tokens}).then((tagsFromDb) => {

            User.findById(userId).then((user) => {
                Tweet.create({
                    message: message,
                    createdBy: user,
                    createdOn: Date.now(),
                    tags: tagsFromDb
                }).then((tweet) => {

                    for(let handleName of handleNames) {
                        Handle.findOne({name: handleName}).then((handle) => {

                            handle.tweets.push(tweet)
                            handle.save()
                            res.redirect('/')
                        })
                    }
                    
                })
            })
        })
    })
  },
  tagNameGet: (req, res) => {

      let tagName = '#' + req.params.tagName
      
      Tweet.find({}).sort('-createdOn').limit(100).populate('tags').then((tweets) => {

          let result = []
          for(let tweet of tweets) {

            for(let tag of tweet.tags){
                if(tag.name == tagName){
                    result.push(tweet)
                }
            }

          }

          res.render('tweet/tag', {
            tweets: result
          })
      })
  }
}
