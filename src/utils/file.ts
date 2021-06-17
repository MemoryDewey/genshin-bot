import fs, { writeFileSync } from 'fs'
import path from 'path'

function mkdirsSync(dirname: string) {
  if (fs.existsSync(dirname)) {
    return true
  } else {
    if (mkdirsSync(path.dirname(dirname))) {
      fs.mkdirSync(dirname)
      return true
    }
  }
}

/**
 * 读取 JSON File
 * @param filePath
 */
export function readJsonFile<T>(filePath: string) {
  const buffer = fs.readFileSync(path.resolve(filePath))
  const jsonString = buffer.toString('utf8')
  return JSON.parse(jsonString) as T
}

export function writeFile(filePath: string, fileName: string, buffer: Buffer) {
  if (!fs.existsSync(filePath)) {
    mkdirsSync(filePath)
  }
  writeFileSync(path.join(filePath, fileName), buffer)
}
