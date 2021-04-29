import { mirai } from 'framework'
import { eventMap, eventType } from 'framework/decorators/type'
import { Type } from 'framework/interfaces/type.interface'

function msgMatchAll(reflectMsg: string, fn: Function) {
  mirai.on('GroupMessage', cb => {
    if (cb.isAt() && cb.plain.trim() == reflectMsg) {
      fn(cb)
    }
  })
}

export function methodEnable(T: Type) {
  return Reflect.getMetadata('module', T) as boolean
}

export function mapModuleInjection(instance: object) {
  const name = instance.constructor.name
  const property = Object.getPrototypeOf(instance)
  const propertyName = Object.getOwnPropertyNames(property)
}

export function mapModuleMethod(instance: object) {
  const name = instance.constructor.name
  const prototype = Object.getPrototypeOf(instance)
  const methodName = Object.getOwnPropertyNames(prototype).filter(
    item => item != 'constructor' && typeof prototype[item] == 'function',
  )
  methodName.map(item => {
    const fn = prototype[item]
    eventMap.map(event => {
      const reflectMsg = Reflect.getMetadata(event, fn) as string
      switch (event as eventType) {
        case 'matchAll':
          msgMatchAll(reflectMsg, fn)
          break
      }
    })
  })
  console.log(`Loader ${name} success`)
}
