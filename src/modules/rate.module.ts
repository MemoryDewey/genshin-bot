import { Module, OnMatchAll } from 'framework/decorators'
import { GroupMessage } from 'mirai-ts/dist/types/message-type'
import { genAtMsg } from 'src/utils/bot'
import { axios } from 'framework'
import { getImage } from '../utils/image'

@Module()
export class RateModule {
  @OnMatchAll('圣遗物评分')
  private async testMethod(bot: GroupMessage) {
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
      const res = await axios.post('https://api.genshin.pub/api/v1/app/ocr', {
        image: imgBase64,
      })
      await bot.reply(genAtMsg(senderId, JSON.stringify(res.data)))
    } catch (e) {
      await bot.reply(genAtMsg(senderId, '网站解析圣遗物错误'))
    }
  }
}
