const express = require('express')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const { log: { logFormat }, server: { port } } = require('config')
const { logger, stream } = require('./src/logger')
const controller = require('./src/controller')
require('./src/db')

const app = express()
app.use(cookieParser())
app.use(bodyParser.json())
app.use(morgan(logFormat, { stream }))

controller(app)

app.get('/health', (req, res) => {
  res.send('ok')
})

app.use((req, res) => {
  res.status(404).send('Page not found')
})

app.listen(port, () => {
  logger.info(`Server listening on port: ${port}`)
})
