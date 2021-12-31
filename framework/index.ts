import { configs } from 'framework/config'
import axios from 'axios'
import { BotConfig, OneBot } from 'framework/bot'

const oneBotConfig: BotConfig = {
  host: configs.host,
  port: configs.port,
  protocol: configs.protocol,
}
const app = new OneBot(oneBotConfig)

export { app, axios }
