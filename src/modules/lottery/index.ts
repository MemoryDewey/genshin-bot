import { Inject, Module, OnMatchAll } from 'framework/decorators'
import { Database, genAtPlainMsg } from 'src/utils'
import { GroupMessage } from 'mirai-ts/dist/types/message-type'
import { LotteryDB } from 'src/interfaces'

@Module()
export class LotteryModule {
  @Inject('lottery')
  private db: Database<LotteryDB>

  @OnMatchAll('加入卡池', false)
  private async join(bot: GroupMessage) {
    const senderId = bot.sender.id
    const res = this.db.findBy('id', senderId.toString())
    if (res) {
      await bot.reply(genAtPlainMsg(senderId, '已在卡池中，无需重复加入'))
      return
    }
    this.db.insert({ id: senderId.toString(), active: true })
    await bot.reply(genAtPlainMsg(senderId, '加入成功'))
  }
}
