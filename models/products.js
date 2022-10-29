const mongoose = require('mongoose')
const Schema = mongoose.Schema

const productsSchema = new Schema(
  {
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
    info: {
      type: String,
      require: false,
    },
    price: {
      type: Number,
      require: true,
    },
    discount: {
      type: Number,
      require: false,
    },
    quantity: {
      type: Number,
      require: true,
    },
    images: {
      type: Object,
      require: true,
    },
  },
  { timestamps: true },
)

const Products = mongoose.model('Products', productsSchema)
module.exports = Products
