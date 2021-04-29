import { Type } from '../interfaces/type.interface'

export type EventType = 'keyword' | 'matchAll'
export const EventMap = ['keyword', 'matchAll']
export type InjectMetadataValue = {
  type: Type
  key: string
  args: any[]
}
