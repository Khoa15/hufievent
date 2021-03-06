const Question = require("../model/Data")

exports.getAllQuestions = async(req, res, next)=>{
    try {
        const questions = await Question.find({}).sort({id: -1}).exec()
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
        let count = await Question.count()
        count = Math.floor((Math.random() * count) + Number(limit))
        let filter = (topic && topic !== "-1") ? {topic: Number(topic)} : {}
        const data = await Question.find(filter).skip(count).limit(Number(limit))
        res.json({
            success: true,
            total: data.length,
            data,
        })
    } catch (error) {
        console.log(error)
    }
}

exports.getQuestion = async(req, res, next)=>{
    try {
        const question = await Question.findOne({_id: req.params._id})
        res.json({
            success: true,
            result: question
        })
    } catch (error) {
        next(error)
    }
}

exports.createQuestion = async (req, res, next)=>{
    try {
        const question = await Question.create(req.body)
        res.json({
            success: true,
            result: question
        })
    } catch (error) {
        next(error)
    }
}

exports.deleteQuestion = async(req, res, next)=>{
    try {
        const question = await Question.deleteOne(req.body)
        res.json({
            success: true,
            result: question
        })
    } catch (error) {
        next(error)
    }
}

exports.updateQuestion = async(req, res, next)=>{
    try {
        const question = await Question.updateOne({id: res.body.id}, res.body)
        res.json({
            success: true,
            result: question
        })
    } catch (error) {
        next(error)
    }
}