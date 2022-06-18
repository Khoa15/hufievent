const Data = require("../model/Data")

exports.getAllQuestions = async(req, res, next)=>{
    try {
        const questions = await Data.find({})
        res.json({
            success: true,
            result: questions
        })
    } catch (error) {
        next(error)
    }
}

exports.getSomeQuestions = async(req, res, next)=>{
    try {
        const { limit, topic } = req.query
        console.log(limit, topic)
        let count = await Data.count()
        count = Math.floor((Math.random() * count) + Number(limit))
        let filter = (topic && topic !== "-1") ? {topic: Number(topic)} : {}
        const data = await Data.find(filter).skip(count).limit(Number(limit))
        res.json({
            success: true,
            total: data.length,
            data,
        })
    } catch (error) {
        console.log(error)
    }
}