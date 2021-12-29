import WebSocket from 'ws'
import { EventCallback, EventMessage, ReplyCallback, SenderInfo } from './connect'
import { JsonString2Object } from '../utils/json'
import { logger } from '../utils'

class Bot {
  public sender: SenderInfo
  public isAt: boolean
  public isAdmin: boolean
  public message: string
  //public image?: File

  constructor(message: EventMessage) {
    this.sender = message.sender
  }
}

class OneBot {
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
      console.log('EventSocket启动成功')
    }
    this.eventSocket.onclose = () => {
      console.log('EventSocket已关闭')
    }
    this.apiSocket.onopen = () => {
      console.log('ApiSocket启动成功')
    }
    this.apiSocket.onopen = () => {
      console.log('ApiSocket已关闭')
    }
  }

  private static print(message: EventMessage) {
    logger.info(
      `Get message from ${message.user_id}${
        message.message_type == 'group' ? `@[群:${message.group_id}]` : ''
      }:${message.message}`,
    )
  }

  /**
   * 接收到消息后触发
   */
  public onMessage(callback: EventCallback) {
    this.eventSocket.on('message', data => {
      const parse = JsonString2Object<EventMessage>(data.toString())
      if (parse.post_type == 'message') {
        OneBot.print(parse)
        callback(parse)
      }
    })
  }
  public onGroupMessage(callback: ReplyCallback<Bot>) {
    this.onMessage(message => {
      if (message.message_type == 'group') {
        const bot = new Bot(message)
        const replyInfo = callback(bot)
        console.log(replyInfo)
        //this.apiSocket.send()
      }
    })
  }
  /*public onFullMatch(word: string, callback: EventCallback) {
    callback()
  }*/
}
