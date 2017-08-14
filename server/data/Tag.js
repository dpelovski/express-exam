const mongoose = require('mongoose')

let tagSchema = new mongoose.Schema({
    name: {type: String, required: true, unique: true}
})

let Tag = mongoose.model('Tag', tagSchema)

module.exports = Tag