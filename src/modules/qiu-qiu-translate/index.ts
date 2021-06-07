import { Module, OnPrefix } from 'framework/decorators'
import { GroupMessage } from 'mirai-ts/dist/types/message-type'
import { qiuQiuPhraseTranslation, qiuQiuWordTranslation } from './util'

@Module()
export class QiuQiuTranslate {
  private readonly suffix =
    '\n※ 这个插件只能从丘丘语翻译为中文，不能反向翻译\n' +
    '※ 发送词语时请注意空格位置是否正确，词语不区分大小写，不要加入任何标点符号\n' +
    '※ 翻译数据来源于 米游社论坛 https://bbs.mihoyo.com/ys/article/2286805 \n' +
    '※ 如果你有更好的翻译欢迎来提出 issues'

  @OnPrefix('丘丘一下', false)
  private async qiuQiuWord(bot: GroupMessage, extraMsg: string[]) {
    if (extraMsg.length == 0) {
      return
    }
    let msg = qiuQiuWordTranslation(extraMsg)
    msg += this.suffix
    await bot.reply(msg, false)
  }

  @OnPrefix('丘丘词典', false)
  private async qiuQiuPhrase(bot: GroupMessage, extraMsg: string[]) {
    if (extraMsg.length == 0) {
      return
    }
    let msg = qiuQiuPhraseTranslation(extraMsg.join(' '))
    msg += this.suffix
    await bot.reply(msg, false)
  }
}
