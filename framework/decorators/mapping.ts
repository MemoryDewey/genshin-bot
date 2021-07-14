import { mirai } from 'framework'
import { EventMap, EventType, InjectMetadataValue, MsgFunc } from './type'
import { Type } from 'framework/interfaces/type.interface'
import {
  MODULE_METADATA,
  ON_MATCH_ALL_METADATA,
  ON_PREFIX_METADATA,
  ON_PRIVATE_PREFIX,
  REPOSITORY_METADATA,
} from './metadata'
import { FriendMessage, TempMessage } from 'mirai-ts/dist/types/message-type'
import { getRepository } from 'typeorm'

/**
 * 完全匹配
 * @param instance 实体对象
 * @param item 方法名
 * @param msg 注入的msg
 * @param isAt
 */
const msgMatchAll: MsgFunc = (instance, item, msg, isAt) => {
  mirai.on('GroupMessage', cb => {
    if ((isAt ? cb.isAt() : true) && cb.plain.trim() == msg) {
      instance[item](cb)
    }
  })
}

/**
 * 前缀匹配
 * @param instance
 * @param item
 * @param msg
 * @param isAt
 */
const msgPrefix: MsgFunc = (instance, item, msg, isAt) => {
  mirai.on('GroupMessage', cb => {
    const plainArr = cb.plain.trim().split(' ')
    if ((isAt ? cb.isAt() : true) && plainArr.length > 1 && plainArr[0] == msg) {
      instance[item](
        cb,
        plainArr.filter((value, index) => index != 0 && value),
      )
    }
  })
}

const privatePrefix: MsgFunc = (instance, item, msg) => {
  const func = (cb: TempMessage | FriendMessage) => {
    const plainArr = cb.plain.trim().split(' ')
    if (plainArr.length > 1 && plainArr[0] == msg) {
      instance[item](
        cb,
        plainArr.filter((value, index) => index != 0 && value),
      )
    }
  }
  mirai.on('TempMessage', cb => {
    func(cb)
  })
  mirai.on('FriendMessage', cb => {
    func(cb)
  })
}

export function methodEnable(T: Type) {
  return Reflect.getMetadata(MODULE_METADATA, T) as boolean
}

export function mapModuleInjection(instance: object) {
  Object.keys(Object.getPrototypeOf(instance)).forEach(key => {
    const metadata = Reflect.getMetadata(key, instance) as InjectMetadataValue
    if (metadata && metadata.key) {
      instance[key] = new metadata.type(...metadata.args)
    }
  })
}

export function mapRepository(instance: object) {
  Object.keys(Object.getPrototypeOf(instance)).forEach(key => {
    const metadata = Reflect.getMetadata(`${REPOSITORY_METADATA}_${key}`, instance)
    if (metadata) {
      instance[key] = getRepository(metadata)
    }
  })
}

export function mapModuleMethod(instance: object) {
  const name = instance.constructor.name
  const prototype = Object.getPrototypeOf(instance)
  const methodName = Object.getOwnPropertyNames(prototype).filter(
    item => item != 'constructor' && typeof prototype[item] == 'function',
  )
  methodName.map(item => {
    EventMap.map(event => {
      const reflectArg = Reflect.getMetadata(event, prototype[item]) as {
        message: string
        isAt: boolean
      }
      switch (event as EventType) {
        case ON_MATCH_ALL_METADATA:
          msgMatchAll(instance, item, reflectArg?.message, reflectArg?.isAt)
          break
        case ON_PREFIX_METADATA:
          msgPrefix(instance, item, reflectArg?.message, reflectArg?.isAt)
          break
        case ON_PRIVATE_PREFIX:
          privatePrefix(instance, item, reflectArg?.message)
      }
    })
  })
  console.log(`Load ${name} success`)
}
