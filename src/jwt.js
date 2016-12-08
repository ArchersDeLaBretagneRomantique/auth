const jwt = require('jsonwebtoken')
const { jwt: { secret, claims } } = require('config')

function generateToken({ subject }) {
  const jwtOptions = {
    ...claims,
    subject,
  }
  return new Promise((resolve, reject) => {
    jwt.sign({}, secret, jwtOptions, (err, token) => {
      if (err) reject({ status: 500, reason: err })
      else resolve(token)
    })
  })
}

function decodeToken(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) reject({ status: 500, reason: err })
      else resolve(decoded)
    })
  })
}

function refreshToken(token) {
  return decodeToken(token)
    .then(generateToken)
}

exports = {
  generateToken,
  decodeToken,
  refreshToken,
}
