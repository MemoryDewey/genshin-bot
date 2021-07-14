import { InjectRepository, Module, OnMatchAll } from 'framework/decorators'
import { genAtPlainMsg } from 'src/utils'
import { GroupMessage } from 'mirai-ts/dist/types/message-type'
import { Lottery } from 'src/entities'
import { Repository } from 'typeorm'

@Module()
export class LotteryModule {
  @InjectRepository(Lottery)
  private repo: Repository<Lottery>

  @OnMatchAll('加入卡池', false)
  private async join(bot: GroupMessage) {
    const senderId = bot.sender.id
    const res = await this.repo.findOne(senderId)
    if (res) {
      await bot.reply(genAtPlainMsg(senderId, '已在卡池中，无需重复加入'))
      return
    }
    const lottery = new Lottery()
    lottery.id = senderId
    lottery.active = true
    await this.repo.save(lottery)
    await bot.reply(genAtPlainMsg(senderId, '加入成功'))
  }
}
