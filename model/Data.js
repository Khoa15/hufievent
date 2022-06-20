const mongoose = require('mongoose')

const Question = new mongoose.Schema({
    id:{
        type: Number,
        default: Date.now()
    },
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

Question.pre('save', async function(next){
    let question = this
    this.id = Date.now()
    next()
})

module.exports = mongoose.model('Question', Question)