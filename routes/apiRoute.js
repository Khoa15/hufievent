const forms = require('../model/Data')
const express = require('express')
const { getAllUsers, createUser } = require('../controllers/UsersController')
const { getSomeQuestions, getAllQuestions } = require('../controllers/QuestionsController')
const Router = express.Router()

Router.route('/data').get(getSomeQuestions)
Router.route('/question').get(getAllQuestions)

Router.route('/user').get(getAllUsers).post(createUser)


module.exports = Router