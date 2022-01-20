import 'reflect-metadata'
import {
  mapModuleInjection,
  mapModuleMethod,
  mapRepository,
  methodName,
} from 'framework/decorators/mapping'
import { Type } from 'framework/interfaces/type.interface'
import { connection } from 'framework/utils'
import { readJsonFile } from 'framework/utils/json'
import { app } from 'framework'
import { Bot } from './bot'

/**
 * 加载模块
 * @param modules 模块
 */
export async function loadModules(modules: Type[]) {
  const config = readJsonFile<Record<string, boolean>>('config.json')
  const funcArr = modules
    .filter(T => {
      const name = methodName(T)
      return config[name] ?? true
    })
    .map(T => {
      const t = new T()
      mapModuleInjection(t)
      mapRepository(t)
      return mapModuleMethod(t)
    })
    .flat(1)
  // 处理 Map 后的事件
  const onMessage = (bot: Bot) => {
    for (const func of funcArr) {
      const replay = func(bot)
      if (replay) {
        return replay
      }
    }
  }
  // 监听群消息
  app.onGroupMessage(bot => onMessage(bot))
  // 监听私聊消息
  app.onPrivateMessage(bot => onMessage(bot))
}

export async function connectDb() {
  await connection
}
