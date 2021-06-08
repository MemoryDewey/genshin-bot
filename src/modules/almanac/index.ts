import { Inject, Module, OnMatchAll } from 'framework/decorators'
import { checkImageExist, Database, genAtPlainImageMsg } from 'src/utils'
import { GroupMessage } from 'mirai-ts/dist/types/message-type'
import { AlmanacsStore } from './constant'
import { generateAlmanac, getTodayTimestamp } from './util'

@Module()
export class Almanac {
  @Inject('almanac')
  private db: Database

  @OnMatchAll('黄历', false)
  private async getAlmanac(bot: GroupMessage) {
    const senderId = bot.sender.id
    let store = this.db.get(senderId.toString()).value() as AlmanacsStore
    if (!store || (store && store.timestamp != getTodayTimestamp())) {
      await generateAlmanac(senderId)
      store = {
        timestamp: getTodayTimestamp(),
        path: checkImageExist('almanac', senderId.toString()),
      }
    }
    this.db.set(senderId.toString(), store)
    await bot.reply(genAtPlainImageMsg(senderId, '', store.path))
  }
}
