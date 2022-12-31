const Joi = require('joi')
const errorFunction = require('../utils/errorFunction')

const patternPhoneNumber = /[0]{1}[0-9]{9}/

const validation = Joi.object({
  productId: Joi.string().required(),
  productName: Joi.string().min(4).max(100).required(),
  productBrand: Joi.string().required(),
  type: Joi.string().required(),
  quantity: Joi.number().required(),
  price: Joi.number().required(),
  image: Joi.string().required(),
  userId: Joi.string().required(),
  userName: Joi.string().min(4).max(100).required(),
  phone: Joi.string()
    .length(10)
    .pattern(new RegExp(patternPhoneNumber))
    .required(),
  address: Joi.string().min(10).max(200).required(),
  orderStatus: Joi.number().required(),
  cartId: Joi.optional(),
})

const orderValidation = async (req, res, next) => {
  const { error } = validation.validate(req.body)
  if (error) {
    res.status(406)
    return res.json(
      errorFunction(true, `Error in Order Data : ${error.message}`),
    )
  } else {
    next()
  }
}
module.exports = orderValidation
