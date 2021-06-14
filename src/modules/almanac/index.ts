import { Inject, Module, OnMatchAll } from 'framework/decorators'
import { checkImageExist, Database, genAtPlainImageMsg, genAtPlainMsg } from 'src/utils'
import { GroupMessage } from 'mirai-ts/dist/types/message-type'
import { AlmanacsStore, LotsStore } from './constant'
import { generateAlmanac, generateLot, getTodayTimestamp } from './util'

@Module()
export class Almanac {
  @Inject('almanac')
  private db: Database

  @OnMatchAll('黄历', false)
  private async getAlmanac(bot: GroupMessage) {
    const senderId = bot.sender.id
    let store = this.db.get(getTodayTimestamp().toString()).value() as AlmanacsStore
    if (!store || (store && store.timestamp != getTodayTimestamp())) {
      await generateAlmanac()
      store = {
        timestamp: getTodayTimestamp(),
        path: checkImageExist('almanac', getTodayTimestamp().toString()),
      }
    }
    this.db.set(getTodayTimestamp().toString(), store)
    await bot.reply(genAtPlainImageMsg(senderId, '', store.path))
  }

  @OnMatchAll('抽签', false)
  private async getLots(bot: GroupMessage) {
    const senderId = bot.sender.id
    let store = this.db.get(senderId.toString()).value() as LotsStore
    if (store && store.timestamp == getTodayTimestamp()) {
      await bot.reply(
        genAtPlainImageMsg(senderId, '今天已经抽过签啦，明天再来吧~\n', store.path),
      )
    } else {
      const lotAnswer = await generateLot(senderId)
      store = {
        timestamp: getTodayTimestamp(),
        path: checkImageExist('almanac', senderId.toString()),
        lotAnswer,
      }
      this.db.set(senderId.toString(), store)
      await bot.reply(genAtPlainImageMsg(senderId, '', store.path))
    }
  }

  @OnMatchAll('解签', false)
  private async getLotAnswer(bot: GroupMessage) {
    const senderId = bot.sender.id
    const store = this.db.get(senderId.toString()).value() as LotsStore
    if (!store || (store && store.timestamp < getTodayTimestamp())) {
      await bot.reply(genAtPlainMsg(senderId, '你还没抽过签哦~向我说“抽签”试试吧~'))
    } else {
      await bot.reply(genAtPlainMsg(senderId, `\n解签：${store.lotAnswer}`))
    }
  }
}
