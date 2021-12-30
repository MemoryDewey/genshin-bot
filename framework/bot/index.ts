import WebSocket from 'ws'
import { EventCallback, EventMessage, GroupEventMessage, ReplyCallback } from './connect'
import { JsonString2Object } from '../utils/json'
import { logger } from '../utils'
import { BotConfig } from './bot'

export class Bot {
  private event: EventMessage

  //public image?: File

  constructor(message: EventMessage) {
    this.event = message
  }

  /**
   * 发消息的QQ
   */
  public get senderId() {
    return this.event.sender.user_id
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
    const matchList = Array.from(this.event.message.matchAll(/\[CQ:at,qq=[0-9]+]/g))
    return matchList.some(value => value[0].match(/[0-9]+/g)[0] == botId.toString())
  }

  /**
   * 消息的文字部分内容
   */
  public get text() {
    return this.event.message.replaceAll(/\[[^\]]*]/g, '').trim()
  }

  /**
   * 消息中图片的 Urls
   */
  public get imageUrls() {
    const matchList = Array.from(this.event.message.matchAll(/\[CQ:image[^\]]+]/g))
    return matchList.map(value => value[0].match(/(?<=url=)[^\]]+/g)[0])
  }
}

export class OneBot {
  // ws服务端地址
  private readonly address!: string
  // event连接
  private eventSocket!: WebSocket
  // api连接
  private apiSocket!: WebSocket
  // bot实例
  private bot!: Bot

  constructor(config: BotConfig) {
    this.address = `${config.protocol ?? 'ws'}://${config.host}:${config.port}`
  }

  // event连接地址
  private get eventAddress() {
    return `${this.address}/event`
  }

  // api连接地址
  private get apiAddress() {
    return `${this.address}/api`
  }

  // 启动Bot监听
  public start() {
    this.eventSocket = new WebSocket(this.eventAddress)
    this.apiSocket = new WebSocket(this.apiAddress)
    this.eventSocket.onopen = () => {
      logger.info('EventSocket已连接')
    }
    this.eventSocket.onclose = () => {
      logger.error('EventSocket已断开')
    }
    this.apiSocket.onopen = () => {
      logger.info('ApiSocket已连接')
    }
    this.apiSocket.onopen = () => {
      logger.error('ApiSocket已断开')
    }
  }

  private static print(message: EventMessage) {
    logger.info(
      `Get message from ${message.user_id}${
        message.message_type == 'group'
          ? `@[群:${(message as GroupEventMessage).group_id}]`
          : ''
      }:${message.message}`,
    )
  }

  /**
   * 接收到消息后触发
   */
  public onMessage(callback: EventCallback) {
    this.eventSocket.on('message', data => {
      const parse = JsonString2Object<GroupEventMessage>(data.toString())
      if (parse.post_type == 'message') {
        OneBot.print(parse)
        callback(parse)
      }
    })
  }

  public onGroupMessage(callback: ReplyCallback<Bot>) {
    this.onMessage(message => {
      if (message.message_type == 'group') {
        const bot = new Bot(message as GroupEventMessage)
        const replyInfo = callback(bot)
        console.log(replyInfo)
        //this.apiSocket.send(replyInfo)
      }
    })
  }
}
