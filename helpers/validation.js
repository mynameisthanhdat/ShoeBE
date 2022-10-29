const Joi = require('joi')

const addProductSchema = Joi.object({
  productName: Joi.string().min(5).max(100).required(),
  productBrand: Joi.string().max(100).required(),
  type: Joi.string().max(100).required(),
  info: Joi.string(),
  price: Joi.number().required(),
  discount: Joi.number(),
  quantity: Joi.number().required(),
  images: Joi.array().items(Joi.string().required()),
})

const patternPassword = /^[a-zA-Z0-9]{5,30}$/
// const patternEmail = /^[w-.]+@([w-]+.)+[w-]{2,4}$/

const addUserSchema = Joi.object({
  username: Joi.string().min(5).max(30).required(),
  password: Joi.string()
    // .min(5)
    // .max(30)
    .pattern(new RegExp(patternPassword))
    .required(),
  firstName: Joi.string().min(2).max(100).required(),
  lastName: Joi.string().min(2).max(100).required(),
  phone: Joi.number().required(),
  email: Joi.string().email({ tlds: { allow: false } }),
  address: Joi.string().min(10).max(200).required(),
  avatar: Joi.string(),
})

module.exports = {
  addProductSchema,
  addUserSchema,
}
