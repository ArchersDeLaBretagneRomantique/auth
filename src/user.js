const mongoose = require('mongoose')
const { genSalt, hashPassword } = require('./crypto')
const { logger } = require('./logger')

const userSchema = mongoose.Schema({
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
  validation: {
    token: String,
    date: Number,
  },
})

userSchema.pre('save', function (next) {
  genSalt()
    .then(salt => hashPassword(this.password, salt))
    .then((hash) => {
      this.password = hash
      next()
    })
    .catch((err) => {
      logger.error(err)
      next(new Error(err))
    })
})

module.exports = mongoose.model('User', userSchema)
