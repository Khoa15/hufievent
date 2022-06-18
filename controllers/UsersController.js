const mongoose = require('mongoose')
const User = require('../model/User')

exports.getAllUsers = async(req, res, next)=>{
    try{
        const users = await User.find({}).select('name email').exec()
        res.json({
            success: true,
            result: users
        })
    }catch(error){
        console.log(error)
        req.users = null
        next()
    }
}

exports.createUser = async(req, res)=>{
    try{
        if(req.user.permission != 1){
            return false;
        }

        const user = await User.create(req.params)

        req.json({
            success: true,
            result: user
        })

    }catch(error){
        console.log(error)
    }
}