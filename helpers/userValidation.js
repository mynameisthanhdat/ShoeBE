const Joi = require('joi')
const errorFunction = require('../utils/errorFunction')

const patternPassword = /^[a-zA-Z0-9]{5,30}$/
const patternPhoneNumber = /[0]{1}[0-9]{9}/

const validation = Joi.object({
  username: Joi.string().trim(true).min(5).max(30).required(),
  password: Joi.string().pattern(new RegExp(patternPassword)).required().trim(),
  firstName: Joi.string().min(2).max(100).required().trim(),
  lastName: Joi.string().min(2).max(100).required().trim(),
  phone: Joi.string()
    .length(10)
    .pattern(new RegExp(patternPhoneNumber))
    .required()
    .trim(),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .allow('')
    .trim(),
  address: Joi.string().min(10).max(200).allow('').trim(),
  avatar: Joi.string().allow('').trim(),
  isAdmin: Joi.boolean().required(),
})

const userValidation = async (req, res, next) => {
  const payload = {
    username: req.body.username,
    password: req.body.password,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    phone: req.body.phone,
    email: req.body.email,
    address: req.body.address,
    avatar: req.body.avatar,
    isAdmin: req.body.isAdmin,
  }

  const { error } = validation.validate(req.body)
  if (error) {
    res.status(406)
    return res.json(
      errorFunction(true, `Error in User Data : ${error.message}`),
    )
  } else {
    next()
  }
}
module.exports = userValidation
