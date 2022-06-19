const mongoose = require('mongoose')

const Question = new mongoose.Schema({
    q: {
        type: String,
        trim: true,
    },
    a:[
        {
            type: String,
            trim: true
        }
    ],
    qa:
        {
            type: Number,
            min: 0,
            max: 3
        }
    ,
    topic:{
        type: Number,
    },
    published:{
        type: Number,
        min: 0,
        max: 1,
        default: 1
    }
}, {timestamps: true})

module.exports = mongoose.model('Question', Question)