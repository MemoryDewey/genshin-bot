import { mirai } from 'framework'
import { configs } from 'framework/config'
import 'reflect-metadata'
import { Type } from 'framework/interfaces/type.interface'

export async function loadModules(modules: Type[], callback?: () => void) {
  await mirai.link(configs.qq)
  if (callback) {
    mirai.before(callback)
  }
}
