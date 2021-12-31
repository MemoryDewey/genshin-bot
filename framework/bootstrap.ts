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
 */
export async function loadModules(modules: Type[]) {
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
}

export async function connectDb() {
  await connection
}
