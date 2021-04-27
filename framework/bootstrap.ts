import { mirai } from 'framework'
import { configs } from 'framework/config'
import 'reflect-metadata'
import { mapModule, methodEnable } from './decorators/mapping'
import { Type } from 'framework/interfaces/type.interface'

export async function loadModules(modules: Type[], callback?: () => void) {
  modules
    .filter(T => {
      return methodEnable(T)
    })
    .map(T => {
      const t = new T()
      mapModule(t)
    })
  await mirai.link(configs.qq)
  if (callback) {
    mirai.before(callback)
  }
}
