import { Message } from 'mirai-ts'
import { MessageChain } from 'mirai-ts/dist/types/message-type'

export function genAtPlainMsg(id: number, msg: string | string[]) {
  if (Array.isArray(msg)) {
    return [Message.At(id), ...msg.map(m => Message.Plain(m))]
  }
  return [Message.At(id), Message.Plain(msg)]
}

export function genAtPlainImageMsg(
  id: number,
  msg: string | string[],
  base64Img: string,
): MessageChain {
  if (Array.isArray(msg)) {
    return [
      Message.At(id),
      Message.Image(null, null, null, base64Img),
      ...msg.map(m => Message.Plain(m)),
    ]
  } else {
    return [
      Message.At(id),
      Message.Image(null, null, null, base64Img),
      Message.Plain(msg),
    ]
  }
}
