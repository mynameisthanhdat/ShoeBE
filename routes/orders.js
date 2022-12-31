const express = require('express')
const route = express.Router()
const app = express()
const { allowCrossDomain } = require('../utils/corsMiddleware')
const orderValidation = require('../helpers/orderValidation')

const OrdersController = require('../controllers/orders')

app.use(allowCrossDomain)

// route.post('/api/orders/create', orderValidation, OrdersController.addOrder)
route.post(
  '/api/orders/create',
  orderValidation,
  OrdersController.addOrderProduct,
)
route.post('/api/orders/addMultiple', OrdersController.addMultipleOrders)
route.get('/api/orders/getAll', OrdersController.getAllOrders)
route.get('/api/orders/getOrderById/:orderId', OrdersController.getOrderById)
route.get(
  '/api/orders/getOrderByUserId/:userId',
  OrdersController.getOrderByUserId,
)
route.patch('/api/orders/editOrder/:orderId', OrdersController.editOrder)
route.delete(
  '/api/orders/deleteOrderById/:orderId',
  OrdersController.deleteOrderById,
)
route.delete('/api/orders/deleteOrders', OrdersController.deleteMultipleOrder)

module.exports = route
