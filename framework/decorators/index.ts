export const Module = (enable = true): ClassDecorator => {
  return target => Reflect.defineMetadata('module', enable, target)
}

export type eventType = 'keyword' | 'matchAll'
export const eventMap = ['keyword', 'matchAll']

export const EventConstructor = (key: eventType) => (
  message: string,
): MethodDecorator => {
  return (target, propertyKey, descriptor) => {
    Reflect.defineMetadata(key, message, descriptor.value)
  }
}

export const OnMatchAll = EventConstructor('matchAll')
