import { writeFileSync } from 'fs'
import { join } from 'path'
import { DATA_PATH, ROOT_PATH } from '../../../framework/config'
import { createCanvas, loadImage } from 'canvas'
import { readFileSync } from 'fs'

export async function getArtifactsImage(name: string) {
  const canvas = createCanvas(483, 215)
  const ctx = canvas.getContext('2d')
  const artifactsPath = './src/assets/images/artifacts'
  const path = join(ROOT_PATH, artifactsPath, './background.png')
  const file = readFileSync(path)
  const img = await loadImage(file)
  ctx.drawImage(img, 0, 0)
  ctx.font = '32px serif'
  ctx.fillText(name, 24, 64)
  writeFileSync(
    join(DATA_PATH, '/images/genshin/test.jpeg'),
    canvas.toBuffer('image/jpeg', { quality: 1 }),
  )
}

getArtifactsImage('test')
