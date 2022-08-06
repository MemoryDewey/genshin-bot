import { config } from 'dotenv'
import { join } from 'path'

const envParsed = config().parsed
export const configs = {
  host: envParsed.HOST ?? '127.0.0.1',
  port: Number.isNaN(Number(envParsed.PORT)) ? 6700 : Number(envParsed.PORT),
  protocol: envParsed.PROTOCOL as 'ws' | 'wss',
}

export const ROOT_PATH = join(__dirname, '../')
export const ASSET_PATH = './src/assets'
export const FONT_PATH = './src/assets/font'
export const ARTIFACTS_PATH = './src/assets/images/artifacts'
export const RECORDS_PATH = './src/assets/records'
export const IMG_PATH = './src/assets/images'
