const mongoose = require('mongoose')

const data = new mongoose.Schema({
    question: {
        type: String,
        trim: true,
    },
    answer:[
        {
            type: String
        }
    ],
    qa:[
        {
            type: Number,
            min:0,
            max:1
        }
    ],
    topic:{
        type: Number
    },
    published:{
        type: Number,
        min: 0,
        max: 1
    }
})

module.exports = mongoose.model('Question', data)