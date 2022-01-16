import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs'
import path from 'path'

function mkdirsSync(dirname: string) {
  if (existsSync(dirname)) {
    return true
  } else {
    if (mkdirsSync(path.dirname(dirname))) {
      mkdirSync(dirname)
      return true
    }
  }
}

/**
 * 读取 JSON File
 * @param filePath
 */
export function readJsonFile<T>(filePath: string) {
  const buffer = readFileSync(path.resolve(filePath))
  const jsonString = buffer.toString('utf8')
  return JSON.parse(jsonString) as T
}

export function writeFile(filePath: string, fileName: string, buffer: Buffer) {
  if (!existsSync(filePath)) {
    mkdirsSync(filePath)
  }
  writeFileSync(path.join(filePath, fileName), buffer)
}

export function JsonString2Object<T extends object>(data: string) {
  return JSON.parse(data) as T
}
