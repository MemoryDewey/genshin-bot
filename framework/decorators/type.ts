import { Type } from '../interfaces/type.interface'
import { Bot } from '../bot'
import { ReplyContent } from '../bot/connect'
import {
  RecurrenceRule,
  RecurrenceSpecDateRange,
  RecurrenceSpecObjLit,
} from 'node-schedule'

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
) => (bot: Bot) => ReplyContent | Promise<ReplyContent>

export type ScheduleRule =
  | RecurrenceRule
  | RecurrenceSpecDateRange
  | RecurrenceSpecObjLit
  | Date
  | string
  | number
