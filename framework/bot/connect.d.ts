export type PostType = 'message' | 'notice' | 'request' | 'meta_event'
export type MessageType = 'group' | 'private'
export type EventMessage = PrivateEventMessage | GroupEventMessage | GroupRequestMessage
export type EventCallback = (message: EventMessage) => void
export type ReplyMessageMap = {
  text: { text: string }
  image: { file: string }
  at: { qq: string }
  reply: { id: string }
  record: { file: string }
}
export type ReplayMessageType = 'text' | 'image' | 'at' | 'reply' | 'record'
export type ReplyContent = ReplyMessage[] | ReplyMessage[][] | void
export type ReplyCallback<T> = (bot: T) => ReplyContent | Promise<ReplyContent>

export interface BaseEventMessage {
  message_type: MessageType
  post_type: PostType
  self_id: number
}

export interface PrivateEventMessage extends BaseEventMessage {
  font: number
  message: string
  message_id: number
  raw_message: string
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

export interface ReplyMessage {
  type: ReplayMessageType
  data: ReplyMessageMap[ReplayMessageType]
}

export interface ApiMessage {
  data: null | { message_id: number }
  retcode: number
  status: 'ok' | 'failed'
  msg?: string
  wording?: string
}

export interface GroupRequestMessage extends BaseEventMessage {
  time: number
  sub_type: 'add' | 'invite'
  request_type: 'friend' | 'group'
  group_id: number
  user_id: number
  comment: string
  flag: string
}
