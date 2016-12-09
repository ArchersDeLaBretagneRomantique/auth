const {
  cookie: { name: cookieName, properties: cookiePoperties },
} = require('config')
const { signin, signup, validate, decode, refresh } = require('./service')

function controller(app) {
  app.post('/auth/signin', (req, res) => {
    signin(req.body.email, req.body.password)
      .then(token => res.cookie(cookieName, token, cookiePoperties).send())
      .catch(err => res.status(err.status || 500).send(err))
  })

  app.post('/auth/signup', (req, res) => {
    signup(req.body)
      .then(() => res.status(201).send())
      .catch(err => res.status(err.status || 500).send(err))
  })

  app.get('/auth/validate', (req, res) => {
    validate(req.query.token)
      .then(() => res.status(200).send())
      .catch(err => res.status(err.status || 500).send(err))
  })

  app.post('/auth/signout', (req, res) => {
    res.clearCookie(cookieName, cookiePoperties).send()
  })

  app.get('/auth/decode', (req, res) => {
    decode(req.cookies[cookieName])
      .then(user => res.send(user))
      .catch(err => res.status(err.status || 500).send(err))
  })

  app.get('/auth/refresh', (req, res) => {
    refresh(req.cookies[cookieName])
      .then(token => res.cookie(cookieName, token, cookiePoperties).send())
      .catch(err => res.status(err.status || 500).send(err))
  })
}

module.exports = controller
