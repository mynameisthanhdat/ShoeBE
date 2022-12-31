const express = require('express')
const route = express.Router()
const app = express()
const { allowCrossDomain } = require('../utils/corsMiddleware')
const cartValidation = require('../helpers/cartValidation')

const CartController = require('../controllers/carts')

app.use(allowCrossDomain)

// route.post('/api/carts/create', cartValidation, CartController.addCart)
route.post(
  '/api/carts/create',
  cartValidation,
  CartController.addCartAndUpdateCart,
)
route.get('/api/carts/getAll', CartController.getAllCarts)
route.get('/api/carts/getCartById/:orderId', CartController.getCartById)
route.get('/api/carts/getCartByUserId/:userId', CartController.getCartByUserId)
route.patch('/api/carts/editCart/:orderId', CartController.editCart)
route.delete(
  '/api/carts/deleteCartById/:orderId',
  CartController.deleteCartById,
)
route.delete('/api/carts/deleteMultiple', CartController.deleteMultipleCarts)

module.exports = route
