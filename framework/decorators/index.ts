import {
  INJECT_METADATA,
  INJECTABLE_METADATA,
  MODULE_METADATA,
  ON_MATCH_ALL_METADATA,
} from 'framework/decorators/metadata'
import { eventType } from 'framework/decorators/type'

const EventConstructor = (key: eventType) => (message: string): MethodDecorator => {
  return (target, propertyKey, descriptor) => {
    Reflect.defineMetadata(key, message, descriptor.value)
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
  return target => Reflect.defineMetadata(INJECTABLE_METADATA, name, target)
}

/**
 * 在Module中注入可注入的类
 * @param args 类的构造函数参数
 * @constructor
 */
export const Inject = (...args: any[]): PropertyDecorator => {
  return target => Reflect.defineMetadata(INJECT_METADATA, args, target)
}

/**
 * 完全匹配
 */
export const OnMatchAll = EventConstructor(ON_MATCH_ALL_METADATA)
