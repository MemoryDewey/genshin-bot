import Mirai, { MiraiApiHttpSetting } from 'mirai-ts'
import { configs } from 'framework/config'
import axios from 'axios'

const miraiConfig: MiraiApiHttpSetting = {
  adapters: ['http'],
  enableVerify: true,
  verifyKey: configs.authKey,
  singleMode: false,
  cacheSize: 4096,
  adapterSettings: {
    http: {
      host: configs.host,
      port: configs.port,
      cors: ['*'],
    },
    ws: {
      host: configs.host,
      port: configs.port,
      reservedSyncId: '-1',
    },
  },
}

const mirai = new Mirai(miraiConfig)

export { mirai, axios }
