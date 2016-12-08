const { Schema } = require('mongoose')
const db = require('./db')
const { genSalt, hashPassword } = require('./crypto')

const userSchema = Schema({
  id: String,
  email: {
    type: String,
    required: true,
    index: {
      unique: true,
    },
  },
  password: {
    type: String,
    required: true,
  },
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  role: {
    type: [String],
    default: ['ROLE_USER'],
  },
  enabled: {
    type: Boolean,
    default: false,
  },
  locked: {
    type: Boolean,
    default: false,
  },
})

userSchema.pre('save', (next) => {
  const user = this
  genSalt()
    .then(salt => hashPassword(user.password, salt))
    .then((hash) => {
      user.password = hash
      next()
    })
})

exports = db.model('User', userSchema)
