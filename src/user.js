const { Schema } = require('mongoose')
const db = require('./db')

const userSchema = Schema({
  id: String,
  email: String,
  password: String,
  firstname: String,
  lastname: String,
})

exports = db.model('User', userSchema)
