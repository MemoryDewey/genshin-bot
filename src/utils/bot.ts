import { ReplyContent } from 'framework/bot/connect'
import { Message } from 'framework/bot'

export function genAtPlainMsg(qq: number, msg: string | string[]): ReplyContent {
  if (Array.isArray(msg)) {
    return [Message.At(qq), ...msg.map(m => Message.Text(m))]
  }
  return [Message.At(qq), Message.Text(msg)]
}

export function genAtPlainImageMsg(
  id: number,
  msg: string | string[],
  base64Img: string,
): ReplyContent {
  if (Array.isArray(msg)) {
    return [Message.At(id), Message.Image(base64Img), ...msg.map(m => Message.Text(m))]
  } else {
    return [Message.At(id), Message.Image(base64Img), Message.Text(msg)]
  }
}
