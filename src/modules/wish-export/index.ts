import { Inject, InjectRepository, Module, OnPrefix } from 'framework/decorators'
import {
  genAtPlainImageMsg,
  genAtPlainMsg,
  Http,
  parseUrl,
  validateParamKey,
} from 'src/utils'
import { WishParam } from 'src/types'
import { GachaInfo, wishParamKey } from './constant'
import { fetchGachaInfo, generateGachaImg } from './utils'
import { Wish } from 'src/entities'
import { Repository } from 'typeorm'
import { User } from 'src/entities/user.entity'
import { Bot, Message } from 'framework/bot'
import { ReplyContent } from 'framework/bot/connect'

@Module()
export class WishExportModule {
  @Inject(' https://hk4e-api.mihoyo.com')
  private http: Http

  @InjectRepository(Wish)
  private wishRepo: Repository<Wish>

  @InjectRepository(User)
  private userRepo: Repository<User>

  // 私聊 Bot 导入抽卡的链接
  @OnPrefix('导入抽卡链接', { type: 'private' })
  private async importInfo(bot: Bot): Promise<ReplyContent> {
    const errorMsg =
      '参数错误, 只支持如下格式的链接:\n https://webstatic.mihoyo.com/.......#/log'
    const extraMsg = bot.text.substring(7).split(' ')
    if (extraMsg.length > 1) {
      return [Message.Text(errorMsg)]
    }
    const param = parseUrl<WishParam | null>(extraMsg[0])
    if (!param || !validateParamKey(param, wishParamKey)) {
      return [Message.Text(errorMsg)]
    }
    const user = new User(bot.senderId, param)
    await this.userRepo.save(user)
    return [Message.Text('导入成功')]
  }

  @OnPrefix('抽卡分析')
  private async wishAnalysis(bot: Bot): Promise<ReplyContent> {
    const errMsg = '参数错误，请输入:\n 抽卡分析 常驻/新手/角色/武器'
    if (!/^抽卡分析 ((常驻)|(新手)|(角色)|(武器))$/.test(bot.text)) {
      return [Message.Text(errMsg)]
    }
    const name = bot.text.substring(5) as keyof typeof GachaInfo
    const qq = bot.senderId
    const user = await this.userRepo.findOne(qq)
    if (!user) {
      return genAtPlainMsg(qq, '先私聊我添加查询链接才能进行抽卡分析哦')
    }
    const wishes = await this.wishRepo.find({ id: qq })
    let wish = wishes.find(value => value.name === name)
    if (!wish) {
      wish = new Wish(qq, name, [])
    }
    const info = await fetchGachaInfo(name, this.http, wish, user.wishParam)
    await this.wishRepo.save(info.wish)
    const base64Img = await generateGachaImg(qq, name, info.result)
    return genAtPlainImageMsg(
      qq,
      info.isExpire ? '查询已经过期了哦，请重新私聊机器人查询链接' : '',
      base64Img,
    )
  }
}
