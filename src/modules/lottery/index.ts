import { InjectRepository, Module, OnMatchAll } from 'framework/decorators'
import { genAtPlainMsg, random } from 'src/utils'
import { Lottery } from 'src/entities'
import { Repository } from 'typeorm'
import { Bot, Message } from 'framework/bot'
import { ReplyContent } from 'framework/bot/connect'

@Module('lottery')
export class LotteryModule {
  @InjectRepository(Lottery)
  private repo: Repository<Lottery>

  @OnMatchAll('加入卡池')
  private async join(bot: Bot) {
    const senderId = bot.senderId
    const res = await this.repo.findOne(senderId)
    if (res) {
      return genAtPlainMsg(senderId, '已在卡池中，无需重复加入')
    }
    const lottery = new Lottery()
    lottery.id = senderId
    lottery.active = true
    await this.repo.save(lottery)
    return genAtPlainMsg(senderId, '加入成功')
  }

  @OnMatchAll('查看卡池人数')
  private async getSum(): Promise<ReplyContent> {
    const count = await this.repo.count()
    return [Message.Text(`当前卡池中已有${count}人`)]
  }

  @OnMatchAll('清空卡池')
  private async clear(bot: Bot): Promise<ReplyContent> {
    if (!bot.isManager) {
      return [Message.Text('你没有权限进行该操作哦')]
    }
    await this.repo.clear()
    return [Message.Text('清空卡池成功')]
  }

  @OnMatchAll('开奖')
  private async start(bot: Bot): Promise<ReplyContent> {
    if (!bot.isManager) {
      return [Message.Text('你没有权限进行该操作哦')]
    }
    const list = await this.repo.find()
    if (list.length) {
      const index = random.integer({ min: 0, max: list.length - 1 })
      return genAtPlainMsg(list[index].id, '中奖了，请找开奖人领奖')
    }
    return [Message.Text('当前卡池中没有人哦')]
  }
}
