import {
  EventMap,
  EventType,
  InjectMetadataValue,
  MsgFunc,
  MsgFuncConfig,
  ScheduleRule,
} from './type'
import { Type } from 'framework/interfaces/type.interface'
import {
  MODULE_METADATA,
  ON_KEYWORD_METADATA,
  ON_MATCH_ALL_METADATA,
  ON_PREFIX_METADATA,
  ON_REGEX_METADATA,
  ON_SUFFIX_METADATA,
  REPOSITORY_METADATA,
  SCHEDULE_METADATA,
} from './metadata'
import { getRepository } from 'typeorm'
import { scheduleJob } from 'node-schedule'
import { Bot } from 'framework/bot'
import { logger } from '../utils'
import { ReplyContent } from '../bot/connect'

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
): (bot: Bot) => ReplyContent | Promise<ReplyContent> {
  if (config.type == 'group') {
    return bot => {
      if ((config.at ? bot.isAt : true) && pass(bot)) {
        return instance[funcName](bot)
      }
    }
  }
  return bot => {
    if (pass(bot)) {
      return instance[funcName](bot)
    }
  }
}

/**
 * 完全匹配
 * @param instance 实体对象
 * @param funcName 方法名
 * @param config
 */
const onMatchAll: MsgFunc<string | string[]> = (instance, funcName, config) =>
  matchMsg(instance, funcName, config, bot => {
    if (Array.isArray(config.match)) {
      return config.match.includes(bot.text)
    }
    return bot.text === config.match
  })
/**
 * 前缀匹配
 * @param instance
 * @param funcName
 * @param config
 */
const onPrefix: MsgFunc<string> = (instance, funcName, config) =>
  matchMsg(instance, funcName, config, bot => bot.text.startsWith(config.match))
/**
 * 后缀匹配
 * @param instance
 * @param funcName
 * @param config
 */
const onSuffix: MsgFunc<string> = (instance, funcName, config) =>
  matchMsg(instance, funcName, config, bot => bot.text.endsWith(config.match))
/**
 * 关键词匹配
 * @param instance
 * @param funcName
 * @param config
 */
const onKeyword: MsgFunc<string[]> = (instance, funcName, config) =>
  matchMsg(instance, funcName, config, bot =>
    config.match.some(value => bot.text.includes(value)),
  )
/**
 * 正则匹配
 * @param instance
 * @param funcName
 * @param config
 */
const onRegex: MsgFunc<RegExp> = (instance, funcName, config) =>
  matchMsg(instance, funcName, config, bot => config.match.test(bot.text))

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
  const eventArr = methodName
    .map(item => {
      for (const event of EventMap) {
        const reflectArg = Reflect.getMetadata(event, prototype[item]) as MsgFuncConfig<
          string | string[] | RegExp
        >
        if (reflectArg) {
          switch (event as EventType) {
            case ON_MATCH_ALL_METADATA:
              return onMatchAll(
                instance,
                item,
                reflectArg as MsgFuncConfig<string | string[]>,
              )
            case ON_PREFIX_METADATA:
              return onPrefix(instance, item, reflectArg as MsgFuncConfig<string>)
            case ON_SUFFIX_METADATA:
              return onSuffix(instance, item, reflectArg as MsgFuncConfig<string>)
            case ON_KEYWORD_METADATA:
              return onKeyword(instance, item, reflectArg as MsgFuncConfig<string[]>)
            case ON_REGEX_METADATA:
              return onRegex(instance, item, reflectArg as MsgFuncConfig<RegExp>)
          }
        }
      }
      // schedule
      const scheduleReflect = Reflect.getMetadata(
        SCHEDULE_METADATA,
        prototype[item],
      ) as ScheduleRule
      if (scheduleReflect) {
        scheduleJob(`${name}-${item}`, scheduleReflect, instance[item])
      }
    })
    .filter(val => !!val)
  logger.info(`Load ${name} success`)
  return eventArr
}
