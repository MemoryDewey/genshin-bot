export const Module = (enable = true): ClassDecorator => {
  return target => Reflect.defineMetadata('module', enable, target)
}

export const OnKeyword = (message: string, onlyToMe = false): MethodDecorator => {
  return (target, propertyKey, descriptor) => {
    Reflect.defineMetadata('keyword', message, descriptor.value)
  }
}
