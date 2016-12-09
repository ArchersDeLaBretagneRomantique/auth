const mongoose = require('mongoose')
const { logger } = require('./logger')
const { mongodb: { host, port, database } } = require('config')


mongoose.connection.once('open', () => {
  logger.info('MongoDB event open')

  mongoose.connection.on('connected', () => logger.info('MongoDB event connected'))
  mongoose.connection.on('disconnected', () => logger.warn('MongoDB event disconnected'))
  mongoose.connection.on('reconnected', () => logger.info('MongoDB event reconnected'))
  mongoose.connection.on('error', err => logger.error('MongoDB event error', err))
})

mongoose.connect(`mongodb://${host}:${port}/${database}`, (err) => {
  if (err) {
    logger.error('MongoDB connection error', err)
    process.exit(1)
  }
})
