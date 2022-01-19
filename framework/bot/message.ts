import { ReplyMessage } from './connect'

export class Message {
  static At(qq: string | number): ReplyMessage {
    qq = typeof qq == 'number' ? qq.toString() : qq
    return { type: 'at', data: { qq } }
  }
  static Text(text: string): ReplyMessage {
    return { type: 'text', data: { text } }
  }
  static Image(file: string): ReplyMessage {
    return { type: 'image', data: { file } }
  }
  static Reply(id: string | number): ReplyMessage {
    id = typeof id == 'number' ? id.toString() : id
    return { type: 'reply', data: { id } }
  }
  static Record(file: string): ReplyMessage {
    return { type: 'record', data: { file } }
  }
}
