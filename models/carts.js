const mongoose = require('mongoose')
const Schema = mongoose.Schema

const cartsSchema = new Schema(
  {
    userId: {
      type: String,
      require: true,
    },
    productId: {
      type: String,
      require: true,
    },
    productName: {
      type: String,
      require: true,
    },
    productBrand: {
      type: String,
      require: true,
    },
    type: {
      type: String,
      require: true,
    },
    quantity: {
      type: Number,
      require: true,
    },
    price: {
      type: Number,
      require: true,
    },
    images: {
      type: String,
      require: true,
    },
  },
  { timestamps: true },
)

const Carts = mongoose.model('Carts', cartsSchema)
module.exports = Carts
