import { Inject, Module, OnMatchAll, OnPrefix } from 'framework/decorators'
import { GroupMessage } from 'mirai-ts/dist/types/message-type'
import { AxiosError } from 'axios'
import { OcrResponse, RateError } from 'src/interfaces'
import {
  checkImageExist,
  genAtPlainImageMsg,
  genAtPlainMsg,
  getImageFromUrl,
  Http,
  Database,
} from 'src/utils'
import { Message } from 'mirai-ts'
import { calcMainPropScore, calcSubPropScore } from './uitl'

@Module()
export class RateModule {
  @Inject('https://api.genshin.pub/api')
  private http: Http

  @Inject()
  private db: Database

  private readonly userUploadKey = 'artifacts'

  protected ocrResToStr(data: OcrResponse): string[] {
    return [
      `${data.name}\n`,
      `${data.main_item.name} : ${data.main_item.value}\n`,
      ...data.sub_item.map(item => `${item.name} : ${item.value}\n`),
    ]
  }

  protected getImgPath(name: string) {
    return checkImageExist('artifacts', name)
  }

  protected async rateArtifacts(bot: GroupMessage, ocr: OcrResponse) {
    const mainScore = calcMainPropScore(ocr.main_item)
    const subScore = calcSubPropScore(ocr.sub_item)
    if (mainScore == -1 || subScore == -1) {
      await bot.reply(
        genAtPlainMsg(bot.sender.id, [
          `${mainScore == -1 ? '主' : '副'}词条输入有误\n`,
          ...this.ocrResToStr(ocr),
        ]),
      )
      return
    }
    await bot.reply(
      genAtPlainMsg(
        bot.sender.id,
        '\n' +
          `总分: ${((mainScore + subScore) * 100) / 100}\n` +
          `主词条分数: ${mainScore}\n` +
          `副词条分数: ${subScore}`,
      ),
    )
  }

  @OnMatchAll('评分网站', false)
  private async getRateHref(bot: GroupMessage) {
    await bot.reply([Message.Plain('https://genshin.pub/relic')])
  }

  @OnMatchAll('圣遗物评分')
  private async uploadArtifacts(bot: GroupMessage) {
    const senderId = bot.sender.id
    const image = bot.get('Image')
    if (image == null) {
      await bot.reply(genAtPlainMsg(senderId, '你上传的圣遗物图片嘞？'))
      return
    }
    if (image.url == null) {
      await bot.reply(genAtPlainMsg(senderId, '找不到你上传的图片了，请重新上传'))
      return
    }
    const imgBase64 = await getImageFromUrl(image.url)
    try {
      const { data } = await this.http.post<OcrResponse>('/v1/app/ocr', {
        image: imgBase64,
      })
      await this.rateArtifacts(bot, data)
    } catch (e) {
      const error = e as AxiosError
      const data = error.response.data as RateError
      await bot.reply(genAtPlainMsg(senderId, data.message))
    }
  }

  @OnPrefix('修改', false)
  private async changeArtifacts(bot: GroupMessage, extra: string[]) {
    const quote = bot.get('Quote')
    const senderId = bot.sender.id
    if (!quote) {
      return
    }
    if (extra.length % 2 != 0) {
      await bot.reply(genAtPlainMsg(senderId, '参数错误'))
      return
    }
    const rateValue = this.db
      .get(`${this.userUploadKey}:${bot.sender.id}`)
      .value() as OcrResponse
    for (let i = 0; i < extra.length; i += 2) {
      const key = extra[i]
      if (key == '主') {
        rateValue.main_item.value = extra[i + 1]
      } else if (key.includes('副')) {
        const index = key.charAt(key.length - 1)
        const subIndex = parseInt(index)
        if (subIndex <= 4 && subIndex >= 1) {
          rateValue.sub_item[subIndex - 1].value = extra[i + 1]
        } else {
          await bot.reply(genAtPlainMsg(senderId, '参数错误'))
          return
        }
      }
    }
    await this.rateArtifacts(bot, rateValue)
  }
}
