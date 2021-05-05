import { Type } from '../interfaces/type.interface'

export type EventType = 'keyword' | 'matchAll' | 'prefix'

export const EventMap = ['keyword', 'matchAll', 'prefix']

export type InjectMetadataValue = {
  type: Type
  key: string
  args: any[]
}

export type MsgFunc = (instance: object, item: string, msg: string, isAt: boolean) => void
