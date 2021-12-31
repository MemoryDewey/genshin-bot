import axios from 'axios'
import { Canvas } from 'canvas'

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

export function canvas2Base64(canvas: Canvas) {
  return canvas
    .toDataURL('image/png')
    .replace(/^data:image\/(png|jpg);base64,/, 'base64://')
}
