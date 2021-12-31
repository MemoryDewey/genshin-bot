import { Type } from '../interfaces/type.interface'

export type EventType = 'keyword' | 'matchAll' | 'prefix' | 'suffix' | 'regex'

export const EventMap = ['keyword', 'matchAll', 'prefix', 'suffix', 'regex']

export type InjectMetadataValue = {
  type: Type
  key: string
  args: any[]
}

export type MsgFuncConfig<T> = {
  match: T
  type?: 'group' | 'private'
  at?: boolean
}

export type MsgFunc<T> = (
  instance: object,
  funcName: string,
  config: MsgFuncConfig<T>,
) => void
