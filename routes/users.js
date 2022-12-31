const express = require('express')
const route = express.Router()
const app = express()
const { allowCrossDomain } = require('../utils/corsMiddleware')
const userValidation = require('../helpers/userValidation')

const UsersController = require('../controllers/users')

app.use(allowCrossDomain)

route.post('/api/auths/register', userValidation, UsersController.register)
route.post('/api/auths/login', UsersController.login)
route.post('/api/auths/change-password', UsersController.changePassword)
route.post('/api/auths/forgot-password', UsersController.forgotPassword)

module.exports = route
