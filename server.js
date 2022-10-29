const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const ProductsRoute = require('./routes/products')

const connection_string =
  'mongodb+srv://admin:1111@cluster0.dadycby.mongodb.net/test'

mongoose.connect(connection_string, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

const database = mongoose.connection

const app = express()

app.use(express.json())

const PORT = 5000

app.listen(PORT || 3000, () => {
  console.log(`Server is running on port ${PORT}`)
})

database.on('error', (error) => {
  console.log(error)
})

database.once('connected', () => {
  console.log('Database Connected')
})

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use('', ProductsRoute)
