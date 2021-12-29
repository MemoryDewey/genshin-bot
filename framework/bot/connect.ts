export type PostType = 'message' | 'notice' | 'request' | 'meta_event'
export type MessageType = 'group' | 'private'
export type EventCallback = (message: EventMessage) => void

export interface SenderInfo {
  area: string
  role: string
  level: string
  user_id: number
  sex: string
  nickname: string
  title: string
  age: number
  card: string
}

export interface EventMessage {
  raw_message: string
  self_id: number
  message_id: number
  message_type: MessageType
  message: string
  group_id?: number
  sender: SenderInfo
  sub_type: string
  user_id: number
  anonymous: any
  post_type: PostType
  time: number
  message_seq: number
  font: number
}
