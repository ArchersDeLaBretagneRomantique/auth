const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const { log: { logFormat }, server: { port } } = require('config')
const { logger, stream } = require('./src/logger')

const app = express()
app.use(bodyParser.json())
app.use(morgan(logFormat, { stream }))

app.post('/auth/signin', (req, res) => {
  res.status(500).send('Not implemented yet')
})

app.post('/auth/signup', (req, res) => {
  res.status(500).send('Not implemented yet')
})

app.post('/auth/signout', (req, res) => {
  res.status(500).send('Not implemented yet')
})

app.get('/auth/validation', (req, res) => {
  res.status(500).send('Not implemented yet')
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
