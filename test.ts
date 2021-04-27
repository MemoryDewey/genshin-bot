import 'reflect-metadata'

const Module = (enable = true): ClassDecorator => {
  return target => Reflect.defineMetadata('module', enable, target)
}

const OnKeyword = (message: string, onlyToMe = false): MethodDecorator => {
  return (target, propertyKey, descriptor) => {
    console.log(target, propertyKey, descriptor)
    Reflect.defineMetadata('keyword', message, descriptor.value)
  }
}

@Module()
class TestModule {
  @OnKeyword('test')
  getMessage() {
    console.log('Get Message')
  }

  @OnKeyword('key')
  getKey() {
    console.log('Get Key')
  }

  @OnKeyword('word')
  getWord() {
    console.log('Get Word')
  }
}

// eslint-disable-next-line @typescript-eslint/ban-types
const mapEvent = (instance: object) => {
  const prototype = Object.getPrototypeOf(instance)
  const methodName = Object.getOwnPropertyNames(prototype).filter(
    item => item != 'constructor' && typeof prototype[item] == 'function',
  )
  methodName.map(item => {
    const fn = prototype[item]
    const ref = Reflect.getMetadata('keyword', fn)
    fn()
  })
}
const m = new TestModule()
mapEvent(m)
/*const data = Reflect.getMetadata('module', TestModule)
const word = Reflect.getMetadata('keyword', new TestModule(), 'getMessage')*/
