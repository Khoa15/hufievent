const express = require('express')
const Router = express.Router()

Router.get('', async(req, res)=>{
    res.render('index', {username: 'NghienDo'})
})

Router.get('/home', (req, res)=>{
    res.render('index2')
})

Router.get('/:page', (req, res)=>{
    res.render(req.params.page)
})

module.exports = Router