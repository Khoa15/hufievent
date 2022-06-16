const express = require('express')
const Router = express.Router()

Router.get('/', (req, res)=>{
    res.render('admin', {name: 'Khoa15', pageTitle: 'Quản Trị'})
})


module.exports = Router