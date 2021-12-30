export type PostType = 'message' | 'notice' | 'request' | 'meta_event'
export type MessageType = 'group' | 'private'
export type EventMessage = PrivateEventMessage | GroupEventMessage
export type EventCallback = (message: EventMessage) => void
// 需要注入一个bot实例 (bot:Bot) => SendMessage
export type ReplyCallback<T> = (bot: T) => SendMessage

export interface PrivateEventMessage {
  font: number
  message: string
  message_id: number
  message_type: MessageType
  post_type: PostType
  raw_message: string
  self_id: number
  sender: PrivateSenderInfo
  sub_type: string
  target_id: number
  time: number
  user_id: number
}

export interface PrivateSenderInfo {
  age: number
  nickname: string
  sex: string
  user_id: number
}

export interface GroupSenderInfo extends PrivateSenderInfo {
  area: string
  role: 'owner' | 'admin' | 'member'
  level: string
  title: string
  card: string
}

export interface GroupEventMessage extends PrivateEventMessage {
  anonymous: any
  group_id: number
  sender: GroupSenderInfo
}

export interface SendMessage {
  qq: number
}
