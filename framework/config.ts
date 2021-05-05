import { config } from 'dotenv'
import { join } from 'path'

const envParsed = config().parsed
const configs = {
  host: envParsed.HOST ?? '127.0.0.1',
  port: Number.isNaN(Number(envParsed.PORT)) ? 8080 : Number(envParsed.PORT),
  authKey: envParsed.AUTH_KEY,
  qq: Number.isNaN(Number(envParsed.QQ)) ? 8080 : Number(envParsed.QQ),
}

const DATA_PATH = join(envParsed.MIRAI_DATA_PATH)
const ROOT_PATH = join(__dirname, '../')

export { configs, DATA_PATH, ROOT_PATH }
