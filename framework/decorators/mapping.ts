import { app as oneBot } from 'framework'
import { EventMap, EventType, InjectMetadataValue, MsgFunc, MsgFuncConfig } from './type'
import { Type } from 'framework/interfaces/type.interface'
import {
  MODULE_METADATA,
  ON_KEYWORD_METADATA,
  ON_MATCH_ALL_METADATA,
  ON_PREFIX_METADATA,
  ON_REGEX_METADATA,
  ON_SUFFIX_METADATA,
  REPOSITORY_METADATA,
} from './metadata'
import { getRepository } from 'typeorm'
import { Bot } from 'framework/bot'
import { logger } from '../utils'

/**
 * 处理消息
 * @param instance
 * @param funcName
 * @param config
 * @param pass
 */
function matchMsg(
  instance: object,
  funcName: string,
  config: MsgFuncConfig<string | RegExp | string[]>,
  pass: (bot: Bot) => boolean,
) {
  if (config.type == 'group') {
    oneBot.onGroupMessage(bot => {
      if ((config.at ? bot.isAt : true) && pass(bot)) {
        return instance[funcName](bot)
      }
    })
    return
  }
  oneBot.onPrivateMessage(bot => {
    if (pass(bot)) {
      return instance[funcName](bot)
    }
  })
}

/**
 * 完全匹配
 * @param instance 实体对象
 * @param funcName 方法名
 * @param config
 */
const onMatchAll: MsgFunc<string | string[]> = (instance, funcName, config) => {
  matchMsg(instance, funcName, config, bot => {
    if (Array.isArray(config.match)) {
      return config.match.includes(bot.text)
    }
    return bot.text === config.match
  })
}
/**
 * 前缀匹配
 * @param instance
 * @param funcName
 * @param config
 */
const onPrefix: MsgFunc<string> = (instance, funcName, config) => {
  matchMsg(instance, funcName, config, bot => bot.text.startsWith(config.match))
}
/**
 * 后缀匹配
 * @param instance
 * @param funcName
 * @param config
 */
const onSuffix: MsgFunc<string> = (instance, funcName, config) => {
  matchMsg(instance, funcName, config, bot => bot.text.endsWith(config.match))
}
/**
 * 关键词匹配
 * @param instance
 * @param funcName
 * @param config
 */
const onKeyword: MsgFunc<string[]> = (instance, funcName, config) => {
  matchMsg(instance, funcName, config, bot =>
    config.match.some(value => bot.text.includes(value)),
  )
}
/**
 * 正则匹配
 * @param instance
 * @param funcName
 * @param config
 */
const onRegex: MsgFunc<RegExp> = (instance, funcName, config) => {
  matchMsg(instance, funcName, config, bot => config.match.test(bot.text))
}

export function methodName(T: Type) {
  return Reflect.getMetadata(MODULE_METADATA, T) as string
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
    EventMap.forEach(event => {
      const reflectArg = Reflect.getMetadata(event, prototype[item]) as MsgFuncConfig<
        string | string[] | RegExp
      >
      if (reflectArg) {
        switch (event as EventType) {
          case ON_MATCH_ALL_METADATA:
            onMatchAll(instance, item, reflectArg as MsgFuncConfig<string | string[]>)
            break
          case ON_PREFIX_METADATA:
            onPrefix(instance, item, reflectArg as MsgFuncConfig<string>)
            break
          case ON_SUFFIX_METADATA:
            onSuffix(instance, item, reflectArg as MsgFuncConfig<string>)
            break
          case ON_KEYWORD_METADATA:
            onKeyword(instance, item, reflectArg as MsgFuncConfig<string[]>)
            break
          case ON_REGEX_METADATA:
            onRegex(instance, item, reflectArg as MsgFuncConfig<RegExp>)
            break
        }
      }
    })
  })
  logger.info(`Load ${name} success`)
}
