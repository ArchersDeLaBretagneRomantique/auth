const express = require('express')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const {
  log: { logFormat },
  server: { port },
  cookie: { name: cookieName, properties: cookiePoperties },
} = require('config')
const { logger, stream } = require('./src/logger')
const { signin, signup, decode, refresh } = require('./src/service')

const app = express()
app.use(cookieParser())
app.use(bodyParser.json())
app.use(morgan(logFormat, { stream }))

app.post('/auth/signin', (req, res) => {
  signin(req.body.email, req.body.password)
    .then(token => res.cookie(cookieName, token, cookiePoperties).send())
    .catch(err => res.status(err.status || 500).send(err))
})

app.post('/auth/signup', (req, res) => {
  signup(req.body)
    .then(() => res.status(201))
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

app.get('/health', (req, res) => {
  res.send('ok')
})

app.use((req, res) => {
  res.status(404).send('Page not found')
})

app.listen(port, () => {
  logger.info(`Server listening on port: ${port}`)
})
