import { InjectRepository, Module, OnMatchAll } from 'framework/decorators'
import { genAtPlainMsg, random } from 'src/utils'
import { GroupMessage } from 'mirai-ts/dist/types/message-type'
import { Lottery } from 'src/entities'
import { Repository } from 'typeorm'
import { configs } from 'framework/config'

@Module(false)
export class LotteryModule {
  @InjectRepository(Lottery)
  private repo: Repository<Lottery>

  protected async isAdmin(bot: GroupMessage) {
    const permission = bot.sender.id == configs.admin
    if (!permission) {
      await bot.reply('你没有权限进行该操作哦')
      return false
    }
    return true
  }

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

  @OnMatchAll('查看卡池人数', false)
  private async getSum(bot: GroupMessage) {
    const count = await this.repo.count()
    await bot.reply(`当前卡池中已有${count}人`)
  }

  @OnMatchAll('清空卡池', false)
  private async clear(bot: GroupMessage) {
    if (!(await this.isAdmin(bot))) {
      return
    }
    await this.repo.clear()
    await bot.reply('清空卡池成功')
  }

  @OnMatchAll('开奖', false)
  private async start(bot: GroupMessage) {
    if (!(await this.isAdmin(bot))) {
      return
    }
    const list = await this.repo.find()
    if (list.length) {
      const index = random.integer({ min: 0, max: list.length - 1 })
      await bot.reply(genAtPlainMsg(list[index].id, '中奖了，请找开奖人领奖'))
      return
    }
    await bot.reply('当前卡池中没有人哦')
  }
}
