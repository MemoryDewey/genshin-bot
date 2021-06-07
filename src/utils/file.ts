import fs from 'fs'
import path from 'path'

/**
 * 读取 JSON File
 * @param filePath
 */
export function readJsonFile<T>(filePath: string) {
  const buffer = fs.readFileSync(path.resolve(filePath))
  const jsonString = buffer.toString('utf8')
  return JSON.parse(jsonString) as T
}
