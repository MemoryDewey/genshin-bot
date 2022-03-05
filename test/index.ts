import { readFileSync } from 'fs'
import { join } from 'path'
import { ROOT_PATH } from '../framework/config'
import { artifactOcr } from '../src/utils/ocr'

const image = readFileSync(join(ROOT_PATH, './test/img.png'))
const imageUrl = `data:image/png;base64,${image.toString('base64')}`

artifactOcr(imageUrl).then(res => {
  console.log(res)
})
