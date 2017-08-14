const mongoose = require('mongoose')

let handleSchema = new mongoose.Schema({
    name: {type: String, required: true, unique: true},
    tweets: [{type: mongoose.Schema.Types.ObjectId, ref: 'Tweet'}]
})

let Handle = mongoose.model('Handle', handleSchema)

module.exports = Handle