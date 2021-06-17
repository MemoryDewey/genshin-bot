import { Type } from '../interfaces/type.interface'

export type EventType = 'keyword' | 'matchAll' | 'prefix' | 'privatePrefix'

export const EventMap = ['keyword', 'matchAll', 'prefix', 'privatePrefix']

export type InjectMetadataValue = {
  type: Type
  key: string
  args: any[]
}

export type MsgFunc = (
  instance: object,
  item: string,
  msg: string,
  isAt?: boolean,
) => void
