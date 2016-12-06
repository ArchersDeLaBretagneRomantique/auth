const winston = require('winston')
const { log } = require('config')

const logger = new winston.Logger({
  level: log.level,
  transports: [
    new winston.transports.Console(),
  ],
})

const stream = {
  write: message => logger.info(message.slice(0, -1)),
}

exports = {
  logger,
  stream,
}
