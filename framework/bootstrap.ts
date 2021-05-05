import { mirai } from 'framework'
import { configs } from 'framework/config'
import 'reflect-metadata'
import {
  mapModuleInjection,
  mapModuleMethod,
  methodEnable,
} from 'framework/decorators/mapping'
import { Type } from 'framework/interfaces/type.interface'

/**
 * 加载模块
 * @param modules 模块
 * @param callback mirai回调
 */
export async function loadModules(modules: Type[], callback?: () => void) {
  modules
    .filter(T => {
      return methodEnable(T)
    })
    .map(T => {
      const t = new T()
      mapModuleInjection(t)
      mapModuleMethod(t)
    })
  await mirai.link(configs.qq)
  if (callback) {
    mirai.before(callback)
  }
}
