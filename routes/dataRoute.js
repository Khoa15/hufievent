const forms = require('../model/Data')
const express = require('express')
const Router = express.Router()

Router.get('/', async function getData(req, res){
    try {
        const { limit, topic } = req.query
        let count = await forms.count()
        count = Math.floor((Math.random() * count) + limit)
        let filter = (topic && topic !== "-1") ? {topic: Number(topic)} : {}
        // filter = {...filter, published: true}
        const data = await forms.find(filter).skip(count).limit(limit)
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

module.exports = Router