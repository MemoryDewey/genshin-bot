import { config } from 'dotenv'

const envParsed = config().parsed
const configs = {
  host: envParsed.HOST ?? '127.0.0.1',
  port: Number.isNaN(Number(envParsed.PORT)) ? 8080 : Number(envParsed.PORT),
  authKey: envParsed.AUTH_KEY,
  qq: Number.isNaN(Number(envParsed.QQ)) ? 8080 : Number(envParsed.QQ),
}

export { configs }
