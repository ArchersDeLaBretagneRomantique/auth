const User = require('./user')
const { generateToken, decodeToken, refreshToken } = require('./jwt')
const { compare } = require('./crypto')

function findUser(email) {
  return new Promise((resolve, reject) => {
    User.findOne({ email }, (err, user) => {
      if (err) reject({ status: 500, reason: err })
      if (!user) reject({ status: 404, reason: 'User not found' })
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
  return new Promise((resolve, reject) => {
    User.create({ email, password, firstname, lastname }, (err) => {
      if (err) reject({ status: err.errors ? 400 : 500, reason: err })
      else resolve()
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

exports = {
  signin,
  signup,
  decode,
  refresh,
}
