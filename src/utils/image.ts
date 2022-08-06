import axios from 'axios'
import { Canvas } from 'canvas'
import { readFileSync } from 'fs'

type Encoding = 'base64' | 'buffer'

export async function getImageFromUrl(url: string, encoding: Encoding = 'base64') {
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

export function canvas2Base64(canvas: Canvas) {
  return canvas
    .toDataURL('image/png')
    .replace(/^data:image\/(png|jpg);base64,/, 'base64://')
}

export function genBase64Url(base64: string) {
  return `base64://${base64}`
}

export function img2Base64(path: string, imageType: 'jpeg' | 'png') {
  return `data:image/${imageType};base64,${readFileSync(path).toString('base64')}`
}
