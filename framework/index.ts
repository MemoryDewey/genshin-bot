import Mirai, { MiraiApiHttpConfig } from 'mirai-ts'
import { configs } from 'framework/config'

const miraiConfig: MiraiApiHttpConfig = {
  host: configs.host,
  port: configs.port,
  authKey: configs.authKey,
  cacheSize: 4096,
}

const mirai = new Mirai(miraiConfig)
const axios = mirai.axios

export { mirai, axios }
