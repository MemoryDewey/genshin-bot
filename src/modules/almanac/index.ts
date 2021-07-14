import { InjectRepository, Module, OnMatchAll } from 'framework/decorators'
import { checkImageExist, genAtPlainImageMsg, genAtPlainMsg } from 'src/utils'
import { GroupMessage } from 'mirai-ts/dist/types/message-type'
import { generateAlmanac, generateLot, getTodayTimestamp } from './util'
import { Almanac, Lots } from 'src/entities'
import { Repository } from 'typeorm'

@Module()
export class AlmanacModule {
  @InjectRepository(Lots)
  private lotsRepo: Repository<Lots>
  @InjectRepository(Almanac)
  private almanacRepo: Repository<Almanac>

  @OnMatchAll('黄历', false)
  private async getAlmanac(bot: GroupMessage) {
    const senderId = bot.sender.id
    const groupId = bot.sender.group.id
    let almanac = await this.almanacRepo.findOne(groupId)
    if (!almanac || (almanac && almanac.timestamp != getTodayTimestamp())) {
      await generateAlmanac()
      almanac = new Almanac()
      almanac.id = groupId
      almanac.timestamp = getTodayTimestamp()
      almanac.path = checkImageExist('almanac', getTodayTimestamp().toString())
      await this.almanacRepo.save(almanac)
    }
    await bot.reply(genAtPlainImageMsg(senderId, '', almanac.path))
  }

  @OnMatchAll('抽签', false)
  private async getLots(bot: GroupMessage) {
    const senderId = bot.sender.id
    const store = await this.lotsRepo.findOne(senderId)
    if (store && store.timestamp == getTodayTimestamp()) {
      await bot.reply(
        genAtPlainImageMsg(senderId, '今天已经抽过签啦，明天再来吧~\n', store.path),
      )
    } else {
      const lotAnswer = await generateLot(senderId)
      const lots = new Lots()
      lots.id = senderId
      lots.timestamp = getTodayTimestamp()
      lots.path = checkImageExist('almanac', senderId.toString())
      lots.lotAnswer = lotAnswer
      await this.lotsRepo.save(lots)
      await bot.reply(genAtPlainImageMsg(senderId, '', lots.path))
    }
  }

  @OnMatchAll('解签', false)
  private async getLotAnswer(bot: GroupMessage) {
    const senderId = bot.sender.id
    const store = await this.lotsRepo.findOne(senderId.toString())
    if (!store || (store && store.timestamp < getTodayTimestamp())) {
      await bot.reply(genAtPlainMsg(senderId, '你还没抽过签哦~向我说“抽签”试试吧~'))
    } else {
      await bot.reply(genAtPlainMsg(senderId, `\n解签：${store.lotAnswer}`))
    }
  }
}
