import { getLogger, configure } from 'log4js'

configure({
  appenders: { consoleout: { type: 'console' } },
  categories: { default: { appenders: ['consoleout'], level: 'debug' } },
})
const logger = getLogger()

export { logger }
