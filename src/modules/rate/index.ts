import {
  Inject,
  InjectRepository,
  Module,
  OnMatchAll,
  OnPrefix,
} from 'framework/decorators'
import { AxiosError } from 'axios'
import { OcrResponse, RateError } from 'src/interfaces'
import { genAtPlainImageMsg, genAtPlainMsg, getImageFromUrl, Http } from 'src/utils'
import { calcMainPropScore, calcSubPropScore, genRatedImage } from './uitl'
import { logger } from 'framework/utils'
import { Repository } from 'typeorm'
import { Rate } from 'src/entities'
import { join } from 'path'
import { ARTIFACTS_PATH, ROOT_PATH } from 'framework/config'
import { readFileSync } from 'fs'
import { Bot } from 'framework/bot'
import { ReplyContent } from 'framework/bot/connect'
import { buffer2base64url } from '../../utils/file'

@Module('rate')
export class RateModule {
  @Inject('https://api.genshin.pub/api')
  private http: Http

  @InjectRepository(Rate)
  private repo: Repository<Rate>

  protected ocrResToStr(data: OcrResponse): string[] {
    return [
      `${data.name}\n`,
      `${data.main_item.name} : ${data.main_item.value}\n`,
      ...data.sub_item.map(item => `${item.name} : ${item.value}\n`),
    ]
  }

  protected async rateArtifacts(bot: Bot, ocr: OcrResponse) {
    const id = bot.senderId
    const mainScore = calcMainPropScore(ocr.main_item, ocr.pos)
    const subScore = calcSubPropScore(ocr.sub_item, ocr.main_item.type, ocr.pos)
    if (mainScore == -1 || subScore == -1) {
      const rate = new Rate(id, ocr)
      await this.repo.save(rate)
      return genAtPlainMsg(id, [
        `${mainScore == -1 ? '主' : '副'}词条输入有误\n`,
        ...this.ocrResToStr(ocr),
      ])
    }
    const total = ((mainScore + subScore) * 100) / 100
    const img = await genRatedImage(ocr, { main: mainScore, sub: subScore, total })
    if (!img) {
      await this.repo.delete({ id })
      return genAtPlainMsg(
        id,
        '\n' +
          `总分: ${total}\n` +
          `主词条分数: ${mainScore}\n` +
          `副词条分数: ${subScore}`,
      )
    }
    await this.repo.delete({ id })
    return genAtPlainImageMsg(id, [], img)
  }

  @OnMatchAll('圣遗物评分', { at: true })
  private async uploadArtifacts(bot: Bot): Promise<ReplyContent> {
    const senderId = bot.senderId
    const imageUrls = bot.imageUrls
    if (imageUrls == null) {
      return genAtPlainMsg(senderId, '你上传的圣遗物图片嘞？')
    }
    const imgBase64 = await getImageFromUrl(imageUrls[0])
    try {
      const { data } = await this.http.post<OcrResponse>('/v1/app/ocr', {
        image: imgBase64,
      })
      if (data.sub_item.length < 4) {
        return genAtPlainMsg(senderId, '请上传4个词条的圣遗物')
      }
      return this.rateArtifacts(bot, data)
    } catch (e) {
      const error = e as AxiosError
      if (error.isAxiosError) {
        logger.error(error.response?.data)
      } else {
        logger.error(e.toString())
        return genAtPlainMsg(senderId, '服务器错误')
      }
      const data = error.response?.data as RateError
      const path = join(ROOT_PATH, ARTIFACTS_PATH, './uploadExample.png')
      const file = readFileSync(path)
      const msg = data?.message ?? '上传图片错误'
      return genAtPlainImageMsg(senderId, msg, buffer2base64url(file))
    }
  }

  @OnPrefix('修改')
  private async changeArtifacts(bot: Bot): Promise<ReplyContent> {
    const senderId = bot.senderId
    if (!/^修改 ((主)|(副[1-4])) \d+(\.\d+)?%?$/.test(bot.text)) {
      return genAtPlainMsg(senderId, '参数错误')
    }
    const rateValue = (await this.repo.findOne(senderId))?.data
    const extra = bot.text.substring(3).split(' ')
    if (rateValue) {
      for (let i = 0; i < extra.length; i += 2) {
        const key = extra[i]
        if (key == '主') {
          rateValue.main_item.value = extra[i + 1]
        } else if (key.includes('副')) {
          const index = key.charAt(key.length - 1)
          const subIndex = parseInt(index)
          rateValue.sub_item[subIndex - 1].value = extra[i + 1]
        }
      }
      return this.rateArtifacts(bot, rateValue)
    }
    return genAtPlainMsg(senderId, '不是你评分的圣遗物哦')
  }
}
