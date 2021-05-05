import axios from 'axios'
import { existsSync } from 'fs'
import { join } from 'path'
import { DATA_PATH } from 'framework/config'
import { ImageType } from '../types'

export async function getImageFromUrl(
  url: string,
  encoding: 'base64' | 'buffer' = 'base64',
) {
  try {
    const res = await axios.get(url, { responseType: 'arraybuffer' })
    const imgBuffer = res.data as ArrayBuffer
    const buffer = Buffer.from(imgBuffer)
    if (encoding == 'buffer') {
      return buffer
    }
    return buffer.toString('base64')
  } catch (e) {
    return false
  }
}

export function checkImageExist(type: ImageType, fileName: string, fileType = 'png') {
  const path = `./genshin/${type}/${fileName}.${fileType}`
  const fullPath = join(DATA_PATH, '/images', path)
  if (existsSync(fullPath)) {
    return path
  }
  return `./genshin/${type}/default.png`
}
