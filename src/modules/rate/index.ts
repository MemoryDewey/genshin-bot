import { Inject, Module, OnMatchAll } from 'framework/decorators'
import { GroupMessage } from 'mirai-ts/dist/types/message-type'
import { AxiosError } from 'axios'
import { OcrResponse, RateError } from 'src/interfaces'
import { genAtMsg, getImage, Http } from 'src/utils'

@Module()
export class Index {
  @Inject('https://api.genshin.pub/api')
  private http: Http

  private ocrResToStr(data: OcrResponse) {
    return ''
  }

  @OnMatchAll('圣遗物评分')
  private async uploadArtifacts(bot: GroupMessage) {
    const senderId = bot.sender.id
    const image = bot.get('Image')
    if (image == null) {
      await bot.reply(genAtMsg(senderId, '你上传的圣遗物图片嘞？'))
      return
    }
    if (image.url == null) {
      await bot.reply(genAtMsg(senderId, '找不到你上传的图片了，请重新上传'))
      return
    }
    const imgBase64 = await getImage(image.url)
    try {
      const res = await this.http.post<OcrResponse>('/v1/app/ocr', {
        image: imgBase64,
      })
      await bot.reply(genAtMsg(senderId, JSON.stringify(res.data)))
    } catch (e) {
      const error = e as AxiosError
      const data = error.response.data as RateError
      await bot.reply(genAtMsg(senderId, data.message))
    }
  }
}
