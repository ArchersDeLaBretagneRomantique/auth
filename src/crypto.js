const Bcrypt = require('bcrypt')
const { bcrypt: { saltFactor } } = require('config')

function genSalt() {
  return new Promise((resolve, reject) => {
    Bcrypt.genSalt(saltFactor, (err, salt) => {
      if (err) reject({ status: 500, reason: err })
      else resolve(salt)
    })
  })
}

function hashPassword(password, salt) {
  return new Promise((resolve, reject) => {
    Bcrypt.hash(password, salt, (err, hash) => {
      if (err) reject({ status: 500, reason: err })
      else resolve(hash)
    })
  })
}

function compare(password, hash) {
  return new Promise((resolve, reject) => {
    Bcrypt.compare(password, hash, (err, isMatch) => {
      if (err) reject({ status: 500, reason: err })
      else if (!isMatch) reject({ status: 404, reason: 'User not found' })
      else resolve()
    })
  })
}

exports = {
  genSalt,
  hashPassword,
  compare,
}
