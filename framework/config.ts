import { config } from 'dotenv'
import { join } from 'path'
import { type } from 'os'

const envParsed = config().parsed
const configs = {
  host: envParsed.HOST ?? '127.0.0.1',
  port: Number.isNaN(Number(envParsed.PORT)) ? 8080 : Number(envParsed.PORT),
  authKey: envParsed.AUTH_KEY,
  qq: Number.isNaN(Number(envParsed.QQ)) ? 8080 : Number(envParsed.QQ),
  admin: Number(envParsed.ADMIN),
}

const DATA_PATH = type().toLowerCase().includes('windows')
  ? join(envParsed.MIRAI_DATA_PATH_WIN)
  : join(envParsed.MIRAI_DATA_PATH_LINUX)
const ROOT_PATH = join(__dirname, '../')

export { configs, DATA_PATH, ROOT_PATH }
