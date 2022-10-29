const mongoose = require('mongoose')
const Schema = mongoose.Schema

const usersSchema = new Schema(
  {
    username: {
      type: String,
      require: true,
    },
    password: {
      type: String,
      require: true,
    },
    firstName: {
      type: String,
      require: true,
    },
    lastName: {
      type: String,
      require: true,
    },
    phone: {
      type: Number,
      require: true,
    },
    email: {
      type: String,
      require: false,
    },
    address: {
      type: String,
      require: false,
    },
    avatar: {
      type: String,
      require: false,
    },
  },
  { timestamps: true },
)

const Users = mongoose.model('Users', usersSchema)
module.exports = Users
