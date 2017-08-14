const mongoose = require('mongoose')
let Tweet = mongoose.model('Tweet')

module.exports = {
  index: (req, res) => {

    Tweet.find({}).sort('-createdOn').populate('tags').limit(100).then((tweets) => {

      let tweetsWithTags = []
      for(let tweet of tweets) {

        let tags = []

        for(let tag of tweet.tags) {
          let name = tag.name.substr(1)
          tags.push(name)
        }

        tweetsWithTags.push({
          tweet: tweet,
          tags: tags
        })
      }
      
      res.render('home/index', {
        tweets: tweetsWithTags
      })
    })
    
  }
}
