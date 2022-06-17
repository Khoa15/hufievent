const mongoose = require('mongoose')
const argon2 = require('argon2')

const User = new mongoose.Schema({
    name: {
        type: String,
        maxLength: 100,
        trim: true,
    },
    email: {
        type: String,
        maxLength: 100,
        trim: true,
    },
    password: {
        type: String,
        minLength: 6,
        maxLength: 100,
        trim: true,
    },
    permission: {
        type: Number,
        default: 1,
    }
}, {timestamps: true})

User.pre('save', async function(next){
    let user = this
    user.password = await argon2.hash(user.password)
    next()
})

module.exports = mongoose.model("User", User)