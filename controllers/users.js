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

const changePassword = async (req, res) => {
  // body request
  // userId - oldPassword - newPassword
  try {
    // get userId to find in DB
    const userId = req.body.userId
    const existingUser = await Users.findById(userId)
    // get user success
    if (!existingUser) {
      res.status(403)
      return res.json(errorFunction(true, 403, 'User is not exists'))
    } else {
      // compare oldPassword vs hashPassword in DB
      const encryptPassword = await bcrypt.compareSync(
        req.body.oldPassword,
        existingUser.password,
      )
      if (encryptPassword) {
        // hash new password
        const hashedPassword = await securePassword(req.body.newPassword)
        // get userId from object user's info in DB
        // const userId = existingUser._id.valueOf();
        // body request
        const request = {
          password: hashedPassword,
        }

        Users.findByIdAndUpdate(userId, request, {
          useFindAndModify: false,
        }).then((data) => {
          if (!data) {
            return res.json(errorFunction(true, 404, 'Bad request'))
          } else {
            res.status(200)
            return res.json(
              errorFunction(
                false,
                200,
                "Updated user's password successfully!",
              ),
            )
          }
        })
      } else {
        res.status(403)
        return res.json(errorFunction(true, 403, 'Password does not match!'))
      }
    }
  } catch (error) {
    return res.json(errorFunction(true, 400, 'Bad Request'))
  }
}

const forgotPassword = async (req, res) => {
  try {
    const existingUser = await Users.findOne({
      email: req.body.email,
    }).lean(true)
    if (!existingUser) {
      res.status(403)
      return res.json(errorFunction(true, 403, 'User does not exists'))
    } else {
      // random a new password
      const randomPassword = Math.random().toString(36).slice(2, 10)
      // get userId from object user's info
      const userId = existingUser._id.valueOf()
      // hash new password
      const hashedPassword = await securePassword(randomPassword)
      // body request
      const request = {
        password: hashedPassword,
      }

      Users.findByIdAndUpdate(userId, request, {
        useFindAndModify: false,
      }).then((data) => {
        if (!data) {
          return res.json(errorFunction(true, 404, 'Bad request'))
        } else {
          const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
              user: 'mynameisthanhdat@gmail.com',
              pass: 'vtafqsbalofwicqe',
            },
          })

          const mailOptions = {
            from: 'datpham011197@gmail.com',
            to: req.body.email,
            subject: 'Sending Email using Node.js',
            text: 'That was easy!',
            html:
              '<p>This is an automation email from ShoesApp. Your password was updated.</b><ul><li>Username: ' +
              existingUser.username +
              '</li><li>Email: ' +
              existingUser.email +
              '</li><li>Password: ' +
              randomPassword +
              '</li></ul>' +
              '<p>Please change your password to protect your information.</p>',
          }

          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              console.log('error: ', error)
            } else {
              console.log('Email sent: ' + info.response)
            }
          })
          return res.json(
            errorFunction(false, 200, "Updated user's password successfully!"),
          )
        }
      })
    }
  } catch (error) {
    res.json(errorFunction(true, 400, 'Bad Request'))
  }
}

module.exports = {
  register,
  login,
  changePassword,
  forgotPassword,
}
