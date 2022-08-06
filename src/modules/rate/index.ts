import { InjectRepository, Module, OnMatchAll, OnPrefix } from 'framework/decorators'
import {
  artifactOcr,
  buffer2base64url,
  genAtPlainImageMsg,
  genAtPlainMsg,
  getImageFromUrl,
  OcrResponse,
} from 'src/utils'
import { calcMainPropScore, calcSubPropScore, genRatedImage, getStatValue } from './uitl'
import { logger } from 'framework/utils'
import { Repository } from 'typeorm'
import { Rate } from 'src/entities'
import { join } from 'path'
import { ARTIFACTS_PATH, ROOT_PATH } from 'framework/config'
import { readFileSync } from 'fs'
import { Bot } from 'framework/bot'
import { ReplyContent, ReplyMessage } from 'framework/bot/connect'
import * as Buffer from 'buffer'
import { app } from 'framework'

@Module('rate')
export class RateModule {
  @InjectRepository(Rate)
  private repo: Repository<Rate>

  protected ocrResToStr(data: OcrResponse): string[] {
    return [
      `${data.piece}\n`,
      `${data.mainStat.name} : ${getStatValue(data.mainStat)}\n`,
      ...data.subStats.map(item => `${item.name} : ${getStatValue(item)}\n`),
    ]
  }

  protected async rateArtifacts(bot: Bot, ocr: OcrResponse) {
    const id = bot.senderId
    const mainScore = calcMainPropScore(ocr.mainStat, ocr.slot)
    const subScore = calcSubPropScore(ocr.subStats, ocr.mainStat.key, ocr.slot)
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
    const imgBuffer = (await getImageFromUrl(imageUrls[0], 'buffer')) as Buffer
    if (imgBuffer.length > 1024 * 1024) {
      return genAtPlainMsg(senderId, '请上传小于 1 MB 的圣遗物图片')
    }
    try {
      app.sendGroupMsg(
        genAtPlainMsg(senderId, '正在识别上传的圣遗物，请稍等......') as ReplyMessage[],
        bot.senderGroupId,
      )
      const ocrRes = await artifactOcr(imageUrls[0])
      if (ocrRes?.subStats?.length < 4) {
        return genAtPlainMsg(senderId, '请上传4个词条的圣遗物')
      }
      return this.rateArtifacts(bot, ocrRes)
    } catch (e) {
      logger.error(e)
      const path = join(ROOT_PATH, ARTIFACTS_PATH, './uploadExample.png')
      const file = readFileSync(path)
      const msg = '上传图片错误'
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
          if (extra[i + 1].includes('%')) {
            rateValue.mainStat.type = 'percent'
          }
          rateValue.mainStat.value = parseFloat(extra[i + 1].split('%')[0])
        } else if (key.includes('副')) {
          const index = key.charAt(key.length - 1)
          const subIndex = parseInt(index)
          if (extra[i + 1].includes('%')) {
            rateValue.mainStat.type = 'percent'
          }
          rateValue.subStats[subIndex - 1].value = parseFloat(extra[i + 1].split('%')[0])
        }
      }
      return this.rateArtifacts(bot, rateValue)
    }
    return genAtPlainMsg(senderId, '不是你评分的圣遗物哦')
  }
}
