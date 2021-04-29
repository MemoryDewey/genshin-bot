import { mirai } from 'framework'
import { EventMap, EventType, InjectMetadataValue } from './type'
import { Type } from 'framework/interfaces/type.interface'
import { INJECT_METADATA, MODULE_METADATA, ON_MATCH_ALL_METADATA } from './metadata'

function msgMatchAll(instance: object, item: string, reflectMsg: string) {
  mirai.on('GroupMessage', cb => {
    if (cb.isAt() && cb.plain.trim() == reflectMsg) {
      instance[item](cb)
    }
  })
}

export function methodEnable(T: Type) {
  return Reflect.getMetadata(MODULE_METADATA, T) as boolean
}

export function mapModuleInjection(instance: object) {
  const metadata = Reflect.getMetadata(INJECT_METADATA, instance) as InjectMetadataValue
  instance[metadata.key] = new metadata.type(...metadata.args)
}

export function mapModuleMethod(instance: object) {
  const name = instance.constructor.name
  const prototype = Object.getPrototypeOf(instance)
  const methodName = Object.getOwnPropertyNames(prototype).filter(
    item => item != 'constructor' && typeof prototype[item] == 'function',
  )
  methodName.map(item => {
    EventMap.map(event => {
      const reflectMsg = Reflect.getMetadata(event, prototype[item]) as string
      switch (event as EventType) {
        case ON_MATCH_ALL_METADATA:
          msgMatchAll(instance, item, reflectMsg)
          break
      }
    })
  })
  console.log(`Load ${name} success`)
}
