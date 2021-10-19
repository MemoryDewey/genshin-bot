import Mirai, { MiraiApiHttpSetting } from 'mirai-ts'
import { configs } from 'framework/config'
import axios from 'axios'

const miraiConfig: MiraiApiHttpSetting = {
  adapters: ['ws', 'http'],
  enableVerify: true,
  verifyKey: configs.authKey,
  singleMode: false,
  cacheSize: 4096,
  adapterSettings: {
    http: {
      host: 'localhost',
      port: 8082,
      cors: ['*'],
    },
    ws: {
      host: 'localhost',
      port: 8080,
      reservedSyncId: '-1',
    },
  },
}

const mirai = new Mirai(miraiConfig)

export { mirai, axios }
