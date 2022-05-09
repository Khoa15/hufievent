const express = require('express')
const Router = express.Router()

Router.get('', async(req, res)=>{
    res.render('index', {username: 'NghienDo'})
})

module.exports = Router