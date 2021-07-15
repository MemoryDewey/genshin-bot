import bunyan from 'bunyan'

const logger = bunyan.createLogger({
  name: 'Logger',
  streams: [{ type: 'rotating-file', path: 'logs/error.log', period: '7d', count: 7 }],
})

export { logger }
