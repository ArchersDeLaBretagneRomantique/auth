const uuidV4 = require('uuid/v4')
const User = require('./user')
const { generateToken, decodeToken, refreshToken } = require('./jwt')
const { compare } = require('./crypto')

function findUser(email) {
  return new Promise((resolve, reject) => {
    User.findOne({ email }, (err, user) => {
      if (err) reject({ status: 500, reason: err })
      else if (!user) reject({ status: 404, reason: 'User not found' })
      else resolve(user)
    })
  })
}

function signin(email, password) {
  return findUser(email)
    .then((user) => {
      compare(password, user.password)
      return user
    })
    .then(user => generateToken({ subject: user.email }))
}

function signup({ email, password, firstname, lastname }) {
  const validation = {
    token: uuidV4(),
    date: Date.now() + (24 * 60 * 60 * 1000),
  }
  return new Promise((resolve, reject) => {
    User.create({ email, password, firstname, lastname, validation }, (err) => {
      if (err) reject({ status: err.errors ? 400 : 500, reason: err })
      else resolve()
    })
  })
}

function validate(token) {
  return new Promise((resolve, reject) => {
    User.findOne({ validation: { token } }, (err, user) => {
      if (err) reject({ status: 500, reason: err })
      else if (!user) reject({ status: 404, reason: 'User not found' })
      else if (user.validation.date < Date.now()) reject({ status: 400, reason: 'Token expired' })
      else {
        User.update({ email: user.email }, { $set: { enabled: true, validation: null } }, (e) => {
          if (e) reject({ status: 500, reason: e })
          else resolve()
        })
      }
    })
  })
}

function decode(token) {
  return decodeToken(token)
    .then(user => Object.assign({}, user, { password: null }))
}

function refresh(token) {
  return refreshToken(token)
}

module.exports = {
  signin,
  signup,
  validate,
  decode,
  refresh,
}
