import {
  Inject,
  InjectRepository,
  Module,
  OnMatchAll,
  OnPrefix,
} from 'framework/decorators'
import { GroupMessage } from 'mirai-ts/dist/types/message-type'
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

@Module()
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

  protected async rateArtifacts(bot: GroupMessage, ocr: OcrResponse) {
    const id = bot.sender.id
    if (ocr.level != 20) {
      await bot.reply(genAtPlainMsg(id, '请上传精炼20级的圣遗物'))
      return
    }
    const mainScore = calcMainPropScore(ocr.main_item, ocr.pos)
    const subScore = calcSubPropScore(ocr.sub_item, ocr.main_item.type, ocr.pos)
    if (mainScore == -1 || subScore == -1) {
      const rate = new Rate(id, ocr)
      await this.repo.save(rate)
      await bot.reply(
        genAtPlainMsg(bot.sender.id, [
          `${mainScore == -1 ? '主' : '副'}词条输入有误\n`,
          ...this.ocrResToStr(ocr),
        ]),
      )
      return
    }
    const total = ((mainScore + subScore) * 100) / 100
    const img = await genRatedImage(ocr, { main: mainScore, sub: subScore, total })
    if (!img) {
      await bot.reply(
        genAtPlainMsg(
          id,
          '\n' +
            `总分: ${total}\n` +
            `主词条分数: ${mainScore}\n` +
            `副词条分数: ${subScore}`,
        ),
      )
      await this.repo.delete({ id: bot.sender.id })
      return
    }
    await bot.reply(genAtPlainImageMsg(id, [], img))
    await this.repo.delete({ id: bot.sender.id })
    return
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
      if (data.sub_item.length < 4) {
        await bot.reply(genAtPlainMsg(senderId, '请上传4个词条的圣遗物'))
      }
      await this.rateArtifacts(bot, data)
      return
    } catch (e) {
      const error = e as AxiosError
      if (error.isAxiosError) {
        logger.error(error.response.data)
      } else {
        await bot.reply(genAtPlainMsg(senderId, '服务器错误'))
        logger.error(e.toString())
      }
      const data = error.response?.data as RateError
      const path = join(ROOT_PATH, ARTIFACTS_PATH, './uploadExample.png')
      const file = readFileSync(path)
      const msg = data?.message ?? '上传图片错误'
      await bot.reply(genAtPlainImageMsg(senderId, msg, file.toString('base64')))
      return
    }
  }

  @OnPrefix('修改', false)
  private async changeArtifacts(bot: GroupMessage, extra: string[]) {
    const senderId = bot.sender.id
    if (extra.length % 2 != 0) {
      await bot.reply(genAtPlainMsg(senderId, '参数错误'))
      return
    }
    const rateValue = (await this.repo.findOne(bot.sender.id))?.data
    if (rateValue) {
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
    } else {
      await bot.reply(genAtPlainMsg(senderId, '不是你评分的圣遗物哦'))
    }

    return
  }
}
