const Question = require('../model/Data')
const express = require('express')
const Router = express.Router()

Router.get('/', async function getData(req, res){
    try {
        const { nums_question, topic } = req.body
        const count = await Question.count()
        const data = await Question.find().skip(Math.floor(Math.random() * count)).limit(nums_question)

        res.json({
            success: true,
            data
        })
    } catch (error) {
        console.log(error)
    }
})

module.exports = Router