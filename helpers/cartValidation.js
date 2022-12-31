const Joi = require('joi')
const errorFunction = require('../utils/errorFunction')

const validation = Joi.object({
  userId: Joi.string().required(),
  productId: Joi.string().required(),
  productName: Joi.string().min(4).max(100).required(),
  productBrand: Joi.string().required(),
  type: Joi.string().required(),
  quantity: Joi.number().required(),
  price: Joi.number().required(),
  image: Joi.string().required(),
})

const cardValidation = async (req, res, next) => {
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
module.exports = cardValidation
