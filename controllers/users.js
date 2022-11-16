const Users = require('../models/users')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const errorFunction = require('../utils/errorFunction')
const securePassword = require('../utils/securePassword')

const register = async (req, res, next) => {
  try {
    const existingEmail = await Users.findOne({
      email: req.body.email,
    }).lean(true)
    const existingUsername = await Users.findOne({
      username: req.body.username,
    }).lean(true)
    if (existingEmail || existingUsername) {
      res.status(403)
      return res.json(errorFunction(true, 403, 'User Already Exists'))
    } else {
      const hashedPassword = await securePassword(req.body.password)
      const newUser = await Users.create({
        username: req.body.username,
        password: hashedPassword,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        phone: req.body.phone,
        email: req.body.email,
        address: req.body.address,
        avatar: req.body.avatar,
        isAdmin: req.body.isAdmin,
      })
      if (newUser) {
        res.status(201)
        return res.json(errorFunction(false, 201, 'User Created', newUser))
      } else {
        res.status(403)
        return res.json(errorFunction(true, 403, 'Error Creating User'))
      }
    }
  } catch (error) {
    res.status(400)
    console.log(error)
    return res.json(errorFunction(true, 400, 'Error Adding user'))
  }
}

const login = (req, res, next) => {
  try {
    var username = req.body.username
    var password = req.body.password
    // username = 'admin'
    Users.findOne({ username: username }).then(
      // Users.findOne({ $or: [{ email: username }, { phone: username }] }).then(
      (user) => {
        if (user) {
          bcrypt.compare(password, user.password, function (err, result) {
            if (err) {
              res.json(errorFunction(true, 400, 'Bad Request'))
            }
            if (result) {
              let access_token = jwt.sign(
                {
                  username: user.username,
                  firstName: user.firstName,
                  lastName: user.lastName,
                  isAdmin: user.isAdmin,
                },
                'secretValue',
                {
                  expiresIn: '1h',
                },
              )
              res.json({
                message: 'Login Successfully!',
                access_token,
                userId: user._id,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                isAdmin: user.isAdmin,
                phone: user.phone,
                address: user.address,
                avatar: user.avatar,
              })
            } else {
              res.json(errorFunction(true, 400, 'Password does not matched!'))
            }
          })
        } else {
          res.json(errorFunction(true, 400, 'No user found!'))
        }
      },
    )
  } catch (error) {
    res.json(errorFunction(true, 400, 'Bad Request'))
  }
}

module.exports = {
  register,
  login,
}
