const { createConnection } = require('mongoose')
const { mongodb: { host, port, database } } = require('config')

exports = createConnection(`mongodb://${host}:${port}/${database}`)
