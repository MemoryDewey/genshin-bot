import winston from 'winston'

const logger = winston.createLogger({
  transports: [
    new winston.transports.File({
      filename: 'logs/error.log',
      maxsize: 1024,
      maxFiles: 10,
    }),
  ],
})

export { logger }
