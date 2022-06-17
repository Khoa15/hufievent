const forms = require('../model/Data')
const express = require('express')
const { getAllUsers, createUser } = require('../controllers/UsersController')
const Router = express.Router()

Router.get('/data', async function getData(req, res){
    try {
        const { limit, topic } = req.query
        console.log(limit, topic)
        let count = await forms.count()
        count = Math.floor((Math.random() * count) + Number(limit))
        let filter = (topic && topic !== "-1") ? {topic: Number(topic)} : {}
        // filter = {...filter, published: true}
        const data = await forms.find(filter).skip(count).limit(Number(limit))
        //const data = await forms.find({})
        res.json({
            success: true,
            total: data.length,
            data,
        })
    } catch (error) {
        console.log(error)
    }
})

Router.route('/user').get(getAllUsers).post(createUser)


module.exports = Router