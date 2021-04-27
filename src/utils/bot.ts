import { Message } from 'mirai-ts'

export function genAtMsg(id: number, msg: string) {
  return [Message.At(id), Message.Plain(msg)]
}
