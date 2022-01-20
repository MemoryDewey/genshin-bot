import { Module, OnKeyword, OnMatchAll } from 'framework/decorators'
import { Bot, Message } from 'framework/bot'
import { ReplyContent } from 'framework/bot/connect'
import { join } from 'path'
import { IMG_PATH, RECORDS_PATH, ROOT_PATH } from 'framework/config'
import { readFileSync } from 'fs'
import { buffer2base64url, random } from 'src/utils'

@Module('deep-chat')
export class DeepChatModule {
  @OnMatchAll(['早安', '早安哦', '早上好', '早上好啊', '早上好呀', '早', 'good morning'])
  public goodMorning(bot: Bot): ReplyContent {
    const nowHours = new Date().getHours()
    let msg = []
    if (nowHours >= 0 && nowHours < 6) {
      msg = [[Message.Text(`好早，现在才${nowHours}点呢`)]]
    } else if (nowHours >= 6 && nowHours < 10) {
      const path = join(ROOT_PATH, RECORDS_PATH, '刻晴早安.mp3')
      const file = readFileSync(path)
      msg = [
        [Message.At(bot.senderId), Message.Text('早上好！今天打算做什么呢？')],
        [Message.Record(buffer2base64url(file))],
      ]
    } else if (nowHours >= 21 && nowHours < 24) {
      msg = [Message.At(bot.senderId), Message.Text('别闹，准备睡觉啦！')]
    } else {
      msg = [Message.At(bot.senderId), Message.Text(`${nowHours}点了才起床吗…`)]
    }
    return msg
  }

  @OnMatchAll(['午安', '午安哦', '中午好', '中午好啊', '中午好呀', '下午好', 'good noon'])
  public goodNoon(bot: Bot): ReplyContent {
    const nowHours = new Date().getHours()
    let msg = []
    if (nowHours >= 11 && nowHours < 13) {
      const path = join(ROOT_PATH, RECORDS_PATH, '刻晴午安.mp3')
      const file = readFileSync(path)
      msg = [
        [Message.At(bot.senderId), Message.Text(`中午好，我们去找刻晴姐姐吧！`)],
        [Message.Record(buffer2base64url(file))],
      ]
    } else if (nowHours >= 13 && nowHours < 16) {
      msg = [Message.At(bot.senderId), Message.Text('下午好！我们去找可莉一起炸鱼吧！')]
    } else if (nowHours >= 17 && nowHours < 18) {
      msg = [Message.At(bot.senderId), Message.Text('准备吃饭了！派蒙想吃蜜酱胡萝卜煎肉')]
    } else {
      return
    }
    return msg
  }

  @OnMatchAll(['晚上好', '晚上好啊', '晚上好呀', 'good evening'])
  public goodEvening(bot: Bot): ReplyContent {
    const nowHours = new Date().getHours()
    let msg = []
    if (nowHours >= 18 && nowHours < 24) {
      const path = join(ROOT_PATH, RECORDS_PATH, '刻晴晚上好.mp3')
      const file = readFileSync(path)
      msg = [
        [Message.At(bot.senderId), Message.Text(`晚上好！今晚想做什么呢？`)],
        [Message.Record(buffer2base64url(file))],
      ]
    } else if (nowHours >= 0 && nowHours < 6) {
      msg = [Message.At(bot.senderId), Message.Text(`${nowHours}点啦，还不睡吗？`)]
    } else if (nowHours >= 6 && nowHours < 9) {
      msg = [Message.At(bot.senderId), Message.Text('晚上好…嗯？我刚起床呢')]
    } else {
      msg = [
        Message.At(bot.senderId),
        Message.Text(`现在才${nowHours}点，还没天黑呢。嘿嘿`),
      ]
    }
    return msg
  }

  @OnMatchAll(['晚安', '晚安哦', '晚安啦', 'good night'])
  public goodNight(bot: Bot): ReplyContent {
    const nowHours = new Date().getHours()
    let msg = []
    if (nowHours <= 3 || nowHours >= 21) {
      const path = join(ROOT_PATH, RECORDS_PATH, '甘雨晚安.mp3')
      const file = readFileSync(path)
      msg = [
        [Message.At(bot.senderId), Message.Text(`晚安~`)],
        [Message.Record(buffer2base64url(file))],
      ]
    } else if (nowHours >= 19 || nowHours < 21) {
      msg = [
        Message.At(bot.senderId),
        Message.Text(`现在才${nowHours}点，这么早就睡了吗？`),
      ]
    } else {
      msg = [
        Message.At(bot.senderId),
        Message.Text(`现在才${nowHours}点，，还没到晚上咧。嘿嘿`),
      ]
    }
    return msg
  }

  @OnMatchAll(['吃派蒙'])
  public eatMe(bot: Bot): ReplyContent {
    return [Message.At(bot.senderId), Message.Text('这样不好，真的')]
  }

  @OnMatchAll(['进不去'])
  public cantInto(): ReplyContent {
    const path = join(ROOT_PATH, RECORDS_PATH, '进不去.mp3')
    const file = readFileSync(path)
    return [Message.Record(buffer2base64url(file))]
  }

  @OnMatchAll(['前面的区域'])
  public frontArea(): ReplyContent {
    const path = join(ROOT_PATH, RECORDS_PATH, '前面的区域.mp3')
    const file = readFileSync(path)
    return [Message.Record(buffer2base64url(file))]
  }

  @OnKeyword(['好色', '好涩', 'hso'])
  public hso(): ReplyContent {
    const path = join(ROOT_PATH, RECORDS_PATH, '好色哦.mp3')
    const file = readFileSync(path)
    return [Message.Record(buffer2base64url(file))]
  }

  @OnMatchAll(['hentai', '变态'])
  public hentai(): ReplyContent {
    const path = join(ROOT_PATH, RECORDS_PATH, '好变态.mp3')
    const file = readFileSync(path)
    return [Message.Record(buffer2base64url(file))]
  }

  @OnMatchAll(['给爷爬', '爬', '爪巴'])
  public fk(): ReplyContent {
    const path = join(ROOT_PATH, RECORDS_PATH, '给爷爬.mp3')
    const file = readFileSync(path)
    return [Message.Record(buffer2base64url(file))]
  }

  @OnMatchAll(['这个仇', '记住'])
  public remember(): ReplyContent {
    const path = join(ROOT_PATH, RECORDS_PATH, '这个仇.mp3')
    const file = readFileSync(path)
    return [Message.Record(buffer2base64url(file))]
  }

  @OnMatchAll(['我歪了', '我放弃了', '我g了', '我寄了', '寄'])
  public chatSympathy(): ReplyContent {
    if (random.integer({ min: 0, max: 99 }) < 90) {
      return [Message.Text('真可惜。不过不要灰心，说不定下一次抽卡就出奇迹了呢！')]
    }
    return [Message.Text('真的吗？好可怜…噗哈哈哈…')]
  }

  @OnMatchAll(['抱抱', '喜欢', 'suki', 'mua'], { at: true })
  public soCute(): ReplyContent {
    const path = join(ROOT_PATH, RECORDS_PATH, '真是个小可爱.mp3')
    const file = readFileSync(path)
    return [Message.Record(buffer2base64url(file))]
  }

  @OnKeyword(['诶嘿', '哎嘿', '欸嘿'])
  public eiHey(): ReplyContent {
    const path = join(ROOT_PATH, RECORDS_PATH, '诶嘿.mp3')
    const file = readFileSync(path)
    return [Message.Record(buffer2base64url(file))]
  }

  @OnKeyword(['大佬', '萌新'])
  public dd5(): ReplyContent {
    const path = join(ROOT_PATH, RECORDS_PATH, '大佬nb.mp3')
    const file = readFileSync(path)
    return [Message.Record(buffer2base64url(file))]
  }

  @OnKeyword(['好臭啊', '野兽先辈', '哼哼', '啊啊'])
  public smelly(): ReplyContent {
    const path = join(ROOT_PATH, IMG_PATH, './chat/臭.jpg')
    const file = readFileSync(path)
    return [Message.Image(buffer2base64url(file))]
  }

  @OnKeyword(['超勇'])
  public iAmBrave(): ReplyContent {
    const path = join(ROOT_PATH, IMG_PATH, './chat/勇.jpg')
    const file = readFileSync(path)
    return [Message.Image(buffer2base64url(file))]
  }

  @OnKeyword(['不会吧'])
  public ohNo(): ReplyContent {
    const path = join(ROOT_PATH, IMG_PATH, './chat/不会吧.jpg')
    const file = readFileSync(path)
    return [Message.Image(buffer2base64url(file))]
  }

  @OnKeyword(['啊这'])
  public az(): ReplyContent {
    const randomInt = random.integer({ min: 1, max: 9 })
    const path = join(ROOT_PATH, IMG_PATH, `./chat/啊这 (${randomInt}).jpg`)
    const file = readFileSync(path)
    return [Message.Image(buffer2base64url(file))]
  }

  @OnKeyword(['晒卡', '出货', '我中了', '我出了'])
  public gacha(): ReplyContent {
    const path = join(ROOT_PATH, IMG_PATH, `./chat/gacha.jpg`)
    const file = readFileSync(path)
    return [Message.Image(buffer2base64url(file))]
  }

  @OnKeyword(['肝'])
  public wasteLife(): ReplyContent {
    const path = join(ROOT_PATH, IMG_PATH, `./chat/别肝啦.jpg`)
    const file = readFileSync(path)
    return [Message.Image(buffer2base64url(file))]
  }

  @OnKeyword(['摆烂', '遇到困难'])
  public bai(): ReplyContent {
    const path = join(ROOT_PATH, IMG_PATH, `./chat/遇到困难.jpg`)
    const file = readFileSync(path)
    return [Message.Image(buffer2base64url(file))]
  }

  @OnKeyword(['你有问题'], { at: true })
  public hasTrouble(): ReplyContent {
    const path = join(ROOT_PATH, IMG_PATH, `./chat/123.jpg`)
    const file = readFileSync(path)
    return [Message.Image(buffer2base64url(file))]
  }
}
