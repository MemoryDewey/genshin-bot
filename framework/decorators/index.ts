import {
  MODULE_METADATA,
  ON_KEYWORD_METADATA,
  ON_MATCH_ALL_METADATA,
  ON_PREFIX_METADATA,
  ON_SUFFIX_METADATA,
  REPOSITORY_METADATA,
  SCHEDULE_METADATA,
} from 'framework/decorators/metadata'
import {
  EventType,
  InjectMetadataValue,
  MsgFuncConfig,
  ScheduleRule,
} from 'framework/decorators/type'
import { Type } from '../interfaces/type.interface'

const EventConstructor =
  <T>(key: EventType) =>
  (match: T, config?: Pick<MsgFuncConfig<T>, 'type' | 'at'>): MethodDecorator => {
    return (target, propertyKey, descriptor) => {
      Reflect.defineMetadata(
        key,
        {
          match,
          type: config?.type ?? 'group',
          at: config?.at ?? false,
        },
        descriptor.value,
      )
    }
  }

/**
 * 可执行的模块
 * @param name moduleName
 * @constructor
 */
export const Module = (name?: string): ClassDecorator => {
  return target => Reflect.defineMetadata(MODULE_METADATA, name ?? target.name, target)
}

/**
 * 可注入的类
 * @param name 类名
 * @constructor
 */
export const Injectable = (name?: string): ClassDecorator => {
  return target => Reflect.defineMetadata(target.name, name, target)
}

/**
 * 在Module中注入可注入的类
 * @param args 类的构造函数参数
 * @constructor
 */
export const Inject = (...args: any[]): PropertyDecorator => {
  return (target, propertyKey) => {
    const type = Reflect.getMetadata('design:type', target, propertyKey)
    target[propertyKey] = null
    return Reflect.defineMetadata(
      propertyKey,
      {
        type,
        key: propertyKey,
        args,
      } as InjectMetadataValue,
      target,
    )
  }
}

export const InjectRepository = <Entity>(entity: Type<Entity>): PropertyDecorator => {
  return (target, propertyKey) => {
    target[propertyKey] = null
    return Reflect.defineMetadata(
      `${REPOSITORY_METADATA}_${propertyKey.toString()}`,
      entity,
      target,
    )
  }
}

export const Schedule = (rule: ScheduleRule): MethodDecorator => {
  return (target, propertyKey, descriptor) => {
    Reflect.defineMetadata(SCHEDULE_METADATA, rule, descriptor.value)
  }
}

// 完全匹配
export const OnMatchAll = EventConstructor(ON_MATCH_ALL_METADATA)
// 前缀匹配
export const OnPrefix = EventConstructor(ON_PREFIX_METADATA)
// 后缀匹配
export const OnSuffix = EventConstructor(ON_SUFFIX_METADATA)
// 关键词匹配
export const OnKeyword = EventConstructor(ON_KEYWORD_METADATA)
