const mongoose = require('mongoose')
let ObjectId = mongoose.Schema.Types.ObjectId

let tweetSchema = new mongoose.Schema({
    message: {type: String, maxlength: 140},
    createdBy: {type: ObjectId, ref: 'User'},
    createdOn: {type: Date, default: Date.now()},
    tags: [{type: ObjectId, ref: 'Tag'}]
})

let Tweet = mongoose.model('Tweet', tweetSchema)

module.exports = Tweet