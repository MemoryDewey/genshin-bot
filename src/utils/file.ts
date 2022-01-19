import * as Buffer from 'buffer'

export function buffer2base64url(buffer: Buffer) {
  return `base64://${buffer.toString('base64')}`
}
