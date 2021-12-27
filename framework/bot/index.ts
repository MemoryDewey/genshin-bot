import WebSocket from 'ws'

class OneBot {
  // ws服务端地址
  private readonly address!: string
  // event连接
  private eventSocket!: WebSocket
  // api连接
  private apiSocket!: WebSocket

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

  /**
   * 接收到消息后触发
   */
  public onMessage(callback) {
    callback()
  }
  public onPrefix(prefix: string | RegExp, callback) {
    callback()
  }
  public onFullMatch(word: string, callback) {
    callback()
  }
}
