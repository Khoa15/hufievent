const mongoose = require('mongoose')

const Topic = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        maxlength: 100,
        minlength: 1,
    },
    published: {
        type: Number,
        default: 1,
        min: 0,
        max: 3,
    }
}, {timestamps: true})

module.exports = mongoose.model('Topic', Topic)