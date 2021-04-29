import axios from 'axios'

export async function getImage(url: string, encoding: 'base64' | 'buffer' = 'base64') {
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
