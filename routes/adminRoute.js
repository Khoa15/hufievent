const express = require('express')
const { getAllUsers } = require('../controllers/UsersController')
const Router = express.Router()

Router.get('/', (req, res)=>{
    res.render('./admin/admin', {name: 'Khoa15', pageTitle: 'Quản Trị'})
})

Router.route('/:page').get(( req, res)=>{
    res.render(`./admin/${req.params.page}`, {name: 'Khoa15', pageTitle: 'Quản Trị'})
})

// Router.route('/api/user').get(getAllUsers)


module.exports = Router