const forms = require('../model/Data')
const express = require('express')
const { getAllUsers, createUser } = require('../controllers/UsersController')
const { getSomeQuestions, getAllQuestions, getQuestion, createQuestion, deleteQuestion, updateQuestion } = require('../controllers/QuestionsController')
const Router = express.Router()

Router.route('/data').get(getSomeQuestions)
Router.route('/question/:id').get(getQuestion).post(updateQuestion)
Router.route('/question').get(getAllQuestions).post(createQuestion).delete(deleteQuestion)

Router.route('/user').get(getAllUsers).post(createUser)


module.exports = Router