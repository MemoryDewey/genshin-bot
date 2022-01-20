import WebSocket from 'ws'
import { logger } from 'framework/utils'
import {
  ApiMessage,
  EventCallback,
  EventMessage,
  GroupEventMessage,
  ReplyCallback,
  ReplyContent,
  ReplyMessage,
} from './connect'
import { JsonString2Object } from 'framework/utils/json'
import { Bot } from './bot'

export interface BotConfig {
  // 主机地址
  host: string
  // 端口
  port: number
  // 协议
  protocol?: 'ws' | 'wss'
  // 连接超时时间
  timeout?: number
}

export class OneBot {
  // ws服务端地址
  private readonly address!: string
  // event连接
  private eventSocket!: WebSocket
  // api连接
  private apiSocket!: WebSocket

  private readonly timeout!: number

  constructor(config: BotConfig) {
    this.address = `${config.protocol ?? 'ws'}://${config.host}:${config.port}`
    this.timeout = config.timeout ?? 5000
  }

  // event连接地址
  private get eventAddress() {
    return `${this.address}/event`
  }

  // api连接地址
  private get apiAddress() {
    return `${this.address}/api`
  }

  private static eventPrint(message: EventMessage) {
    logger.info(
      `Get message from ${message.user_id}${
        message.message_type == 'group'
          ? `@[群:${(message as GroupEventMessage).group_id}]`
          : ''
      }:${message.message}`,
    )
  }

  private static apiPrint(message: ApiMessage) {
    if (message.retcode == 0) {
      logger.info(`Bot send msg success with msg_id: ${message.data?.message_id}`)
    } else {
      logger.error(
        `Bot send msg error: [code:${message.retcode}] [msg: ${message.msg} -> ${message.wording}]`,
      )
    }
  }

  private sendGroupMsg(sendInfo: ReplyMessage[], id: number) {
    this.apiSocket.send(
      JSON.stringify({
        action: 'send_group_msg',
        params: {
          group_id: id,
          message: sendInfo,
        },
      }),
    )
  }

  private sendPrivateMsg(sendInfo: ReplyMessage[], id: number) {
    this.apiSocket.send(
      JSON.stringify({
        action: 'send_private_msg',
        params: {
          user_id: id,
          message: sendInfo,
        },
      }),
    )
  }

  // 启动Bot监听
  public start() {
    this.eventSocket = new WebSocket(this.eventAddress, { timeout: this.timeout })
    this.apiSocket = new WebSocket(this.apiAddress, { timeout: this.timeout })
    this.eventSocket.onopen = () => {
      logger.info('EventSocket已连接')
    }
    this.eventSocket.onclose = () => {
      logger.error('EventSocket已断开')
    }
    this.eventSocket.on('message', data => {
      const message = JsonString2Object<GroupEventMessage>(data.toString())
      if (message.post_type == 'message') {
        OneBot.eventPrint(message)
      }
    })
    this.apiSocket.on('message', data => {
      const message = JsonString2Object<ApiMessage>(data.toString())
      OneBot.apiPrint(message)
    })
  }

  /**
   * 接收到消息后触发
   */
  public onMessage(callback: EventCallback) {
    this.eventSocket.on('message', data => {
      const message = JsonString2Object<GroupEventMessage>(data.toString())
      if (message.post_type == 'message') {
        callback(message)
      }
    })
  }

  /**
   * 群消息事件
   * @param callback
   */
  public onGroupMessage(callback: ReplyCallback<Bot>) {
    this.onMessage(message => {
      if (message.message_type == 'group') {
        const bot = new Bot(message)
        const id = (message as GroupEventMessage).group_id
        const sendMsg = (sendInfo: ReplyContent) => {
          if (!sendInfo) {
            return
          }
          if (sendInfo.some(val => Array.isArray(val))) {
            sendInfo.forEach(value => {
              this.sendGroupMsg(value, id)
            })
          } else {
            this.sendGroupMsg(sendInfo as ReplyMessage[], id)
          }
        }
        const replyInfo = callback(bot)
        if (replyInfo instanceof Promise) {
          replyInfo.then(value => {
            sendMsg(value)
          })
        } else {
          sendMsg(replyInfo)
        }
      }
    })
  }

  /**
   * 私聊消息事件
   * @param callback
   */
  public onPrivateMessage(callback: ReplyCallback<Bot>) {
    this.onMessage(message => {
      if (message.message_type == 'private') {
        const bot = new Bot(message)
        const id = message.user_id
        const sendMsg = (sendInfo: ReplyContent) => {
          if (!sendInfo) {
            return
          }
          if (sendInfo.some(val => Array.isArray(val))) {
            sendInfo.forEach(value => {
              this.sendPrivateMsg(value, id)
            })
          } else {
            this.sendPrivateMsg(sendInfo as ReplyMessage[], id)
          }
        }
        const replyInfo = callback(bot)
        if (replyInfo instanceof Promise) {
          replyInfo.then(value => {
            sendMsg(value)
          })
        } else {
          sendMsg(replyInfo)
        }
      }
    })
  }
}
