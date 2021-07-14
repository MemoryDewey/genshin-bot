import {
  Inject,
  InjectRepository,
  Module,
  OnPrefix,
  OnPrivatePrefix,
} from 'framework/decorators'
import { GroupMessage, TempMessage } from 'mirai-ts/dist/types/message-type'
import {
  checkImageExist,
  genAtPlainImageMsg,
  genAtPlainMsg,
  Http,
  parseUrl,
  validateParamKey,
} from 'src/utils'
import { WishParam } from 'src/types'
import { GachaInfo, gachaNames, wishParamKey } from './constant'
import { fetchGachaInfo, generateGachaImg } from './utils'
import { Wish } from 'src/entities'
import { Repository } from 'typeorm'
import { User } from 'src/entities/user.entity'

@Module()
export class WishExportModule {
  @Inject(' https://hk4e-api.mihoyo.com')
  private http: Http

  @InjectRepository(Wish)
  private wishRepo: Repository<Wish>

  @InjectRepository(User)
  private userRepo: Repository<User>

  // 私聊 Bot 导入抽卡的链接
  @OnPrivatePrefix('导入抽卡链接')
  private async importInfo(bot: TempMessage, extraMsg: string[]) {
    const errorMsg =
      '参数错误, 只支持如下格式的链接:\n https://webstatic.mihoyo.com/.......#/log'
    if (extraMsg.length > 1) {
      await bot.reply(errorMsg)
      return
    }
    const param = parseUrl<WishParam | null>(extraMsg[0])
    if (!param || !validateParamKey(param, wishParamKey)) {
      await bot.reply(errorMsg)
      return
    }
    const user = new User(bot.sender.id, param)
    await this.userRepo.save(user)
    await bot.reply('导入成功')
  }

  @OnPrefix('抽卡分析', false)
  private async wishAnalysis(bot: GroupMessage, extraMsg: string[]) {
    const errMsg = '参数错误，请输入:\n 抽卡分析 常驻/新手/角色/武器'
    if (extraMsg.length > 1 || !gachaNames.includes(extraMsg[0])) {
      await bot.reply(errMsg)
      return
    }
    const qq = bot.sender.id
    const name = extraMsg[0] as unknown as keyof typeof GachaInfo
    const user = await this.userRepo.findOne(qq)
    if (!user) {
      await bot.reply(genAtPlainMsg(qq, '先私聊我添加查询链接才能进行抽卡分析哦'))
      return
    }
    const wishes = await this.wishRepo.find({ id: qq })
    const wish = wishes.find(value => value.name === name)
    await bot.reply(genAtPlainMsg(qq, '正在查询中，不要急哦'))
    const info = await fetchGachaInfo(name, this.http, wish, user.wishParam)
    await this.wishRepo.save(info.wish)
    await generateGachaImg(qq, name, info.result)
    await bot.reply(
      genAtPlainImageMsg(
        qq,
        info.isExpire ? '查询已经过期了哦，请重新私聊机器人查询链接' : '',
        checkImageExist(`${qq}/wish`, name),
      ),
    )
  }
}
