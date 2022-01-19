import { config } from 'dotenv'
import { join } from 'path'

const envParsed = config().parsed
const configs = {
  host: envParsed.HOST ?? '127.0.0.1',
  port: Number.isNaN(Number(envParsed.PORT)) ? 6700 : Number(envParsed.PORT),
  protocol: envParsed.PROTOCOL as 'ws' | 'wss',
}

const ROOT_PATH = join(__dirname, '../')
const ARTIFACTS_PATH = './src/assets/images/artifacts'
const RECORDS_PATH = './src/assets/records'

export { configs, ROOT_PATH, ARTIFACTS_PATH, RECORDS_PATH }
