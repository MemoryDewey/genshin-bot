import {
  MODULE_METADATA,
  ON_MATCH_ALL_METADATA,
  ON_PREFIX_METADATA,
} from 'framework/decorators/metadata'
import { EventType, InjectMetadataValue } from 'framework/decorators/type'

const EventConstructor = (key: EventType) => (
  message: string,
  isAt = true,
): MethodDecorator => {
  return (target, propertyKey, descriptor) => {
    Reflect.defineMetadata(key, { message, isAt }, descriptor.value)
  }
}

/**
 * 可执行的模块
 * @param enable 是否开启模块
 * @constructor
 */
export const Module = (enable = true): ClassDecorator => {
  return target => Reflect.defineMetadata(MODULE_METADATA, enable, target)
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

/**
 * 完全匹配
 */
export const OnMatchAll = EventConstructor(ON_MATCH_ALL_METADATA)

/**
 * 前缀匹配
 */
export const OnPrefix = EventConstructor(ON_PREFIX_METADATA)
