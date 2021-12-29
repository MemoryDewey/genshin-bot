import WebSocket from 'ws'
import { EventEmitter } from 'events'
import { EventCallback, EventMessage, GroupMessageCallBack, SenderInfo } from './connect'
import { JsonString2Object } from '../utils/json'
import { logger } from '../utils'

class Bot {
  private readonly event!: EventEmitter
  public sender!: SenderInfo

  constructor() {
    this.event = new EventEmitter()
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
    this.bot = new Bot()
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
  public onGroupMessage(callback: GroupMessageCallBack) {
    this.onMessage(message => {
      if (message.message_type == 'group') {
        const sendInfo = callback()
        console.log(sendInfo)
        //this.apiSocket.send()
      }
    })
  }
  /*public onFullMatch(word: string, callback: EventCallback) {
    callback()
  }*/
}
