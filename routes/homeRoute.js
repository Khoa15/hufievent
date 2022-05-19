const express = require('express')
const Router = express.Router()

Router.get('', async(req, res)=>{
    res.render('index', {username: 'NghienDo'})
})

Router.get('/home', (req, res)=>{
    res.render('index2')
})

module.exports = Router