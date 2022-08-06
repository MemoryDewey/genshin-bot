import { EventMessage, GroupEventMessage } from './connect'

export class Bot {
  private readonly event: EventMessage

  constructor(message: EventMessage) {
    this.event = message
  }

  /**
   * 发消息的QQ
   */
  public get senderId() {
    return 'sender' in this.event ? this.event.sender.user_id : 0
  }

  /**
   * 发消息的群
   */
  public get senderGroupId() {
    return (this.event as GroupEventMessage).group_id
  }

  /**
   * 是否为管理员
   */
  public get isManager() {
    if (this.event.message_type == 'group') {
      return ['admin', 'owner'].includes((this.event as GroupEventMessage).sender.role)
    }
    return false
  }

  /**
   * 是否为 at bot 的消息
   */
  public get isAt() {
    const botId = this.event.self_id
    if ('message' in this.event) {
      const matchList = Array.from(this.event.message.matchAll(/\[CQ:at,qq=[0-9]+]/g))
      return matchList.some(value => value[0].match(/[0-9]+/g)[0] == botId.toString())
    }
    return false
  }

  /**
   * 消息的文字部分内容
   */
  public get text() {
    return 'message' in this.event
      ? this.event.message.replaceAll(/\[[^\]]*]/g, '').trim()
      : ''
  }

  /**
   * 消息中图片的 Urls
   */
  public get imageUrls(): string[] | null {
    if ('message' in this.event) {
      const matchList = Array.from(this.event.message.matchAll(/\[CQ:image[^\]]+]/g))
      if (!matchList.length) {
        return null
      }
      return matchList.map(value => value[0].match(/(?<=url=)[^\]]+/g)[0])
    }
    return null
  }
}
