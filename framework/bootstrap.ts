import 'reflect-metadata'
import {
  mapModuleInjection,
  mapModuleMethod,
  mapRepository,
  methodName,
} from 'framework/decorators/mapping'
import { Type } from 'framework/interfaces/type.interface'
import { connection } from './utils'
import { readJsonFile } from './utils/json'

/**
 * 加载模块
 * @param modules 模块
 */
export async function loadModules(modules: Type[]) {
  const config = readJsonFile<Record<string, boolean>>('config.json')
  modules
    .filter(T => {
      const name = methodName(T)
      return config[name] ?? true
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
