import { mirai } from 'framework'
import { configs } from 'framework/config'
import 'reflect-metadata'
import {
  mapModuleInjection,
  mapModuleMethod,
  mapRepository,
  methodEnable,
} from 'framework/decorators/mapping'
import { Type } from 'framework/interfaces/type.interface'
import { connection } from './utils'

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
      mapRepository(t)
      mapModuleMethod(t)
    })
  await mirai.link(configs.qq)
  if (callback) {
    mirai.before(callback)
  }
}

export async function connectDb() {
  await connection
}
