import { Almanac, chineseMap, listData, Lot, lotsData } from './constant'
import { join } from 'path'
import { DATA_PATH, ROOT_PATH } from 'framework/config'
import { readFileSync, writeFileSync } from 'fs'
import {
  Canvas,
  createCanvas,
  loadImage,
  NodeCanvasRenderingContext2D,
  registerFont,
} from 'canvas'

function number2chinese(num: number) {
  if (num < 10) {
    return chineseMap[num]
  } else {
    const floor = Math.floor(num / 10)
    return `${chineseMap[floor > 1 ? floor : 0]}十${chineseMap[num % 10]}`
  }
}

function getTodayDateParams() {
  const date = new Date(getTodayTimestamp())

  const year = date.getFullYear().toString()
  const month = `${chineseMap[date.getMonth() + 1]}月`
  const day = number2chinese(date.getDate())
  return { year, month, day }
}

async function generateCanvas(
  canvas: Canvas,
  bgImgName: string,
  timePos: number[][],
): Promise<NodeCanvasRenderingContext2D> {
  const { year, day, month } = getTodayDateParams()
  const ctx = canvas.getContext('2d')

  const fontPath = join(ROOT_PATH, './src/assets/font/Hans.ttf')
  registerFont(fontPath, { family: 'Hans' })
  // 图片路径
  const artifactsPath = './src/assets/images/almanac'
  // 背景图片路径
  const path = join(ROOT_PATH, artifactsPath, `./${bgImgName}`)
  const file = readFileSync(path)
  const img = await loadImage(file)

  ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

  ctx.textBaseline = 'bottom'
  ctx.textAlign = 'center'
  ctx.font = '30px Hans'
  // year
  ctx.fillStyle = '#8d7650'
  ctx.fillText(year, timePos[0][0], timePos[0][1])
  // day
  ctx.fillStyle = '#f7f8f2'
  ctx.fillText(day, timePos[1][0], timePos[1][1])
  // month
  ctx.fillStyle = '#8d7650'
  ctx.fillText(month, timePos[2][0], timePos[2][1])
  return ctx
}

/**
 * 使用随机种子随机选择列表中的元素
 * @param arr
 */
function seedRandomList<T>(arr: T[]) {
  const index = Math.floor(Math.random() * arr.length)
  return arr[index]
}

async function drawImage(buffMap: Map<string, Almanac>, id: number) {
  const canvas = createCanvas(525, 580)
  const ctx = await generateCanvas(canvas, 'back.png', [
    [118, 182],
    [260, 182],
    [410, 182],
  ])

  // buff
  const todayLuck = Array.from(buffMap)
  ctx.textAlign = 'left'
  for (let i = 0; i < 3; i++) {
    const buff = todayLuck[i]
    const debuff = todayLuck[i + 3]
    const buffEffect = seedRandomList(buff[1].buff)
    const debuffEffect = seedRandomList(debuff[1].debuff)
    // buff name
    ctx.font = '25px Hans'
    ctx.fillStyle = '#756141'
    ctx.fillText(buff[0], 150, 265 + i * 53)
    // debuff name
    ctx.fillStyle = '#756141'
    ctx.fillText(debuff[0], 150, 435 + i * 53)
    // buff effect
    ctx.font = '16px Hans'
    ctx.fillStyle = '#b5b3ac'
    ctx.fillText(buffEffect, 150, 280 + i * 53)
    // debuff effect
    ctx.fillStyle = '#b5b3ac'
    ctx.fillText(debuffEffect, 150, 450 + i * 53)
  }

  writeFileSync(
    join(DATA_PATH, `/images/genshin/almanac/${id}.png`),
    canvas.toBuffer('image/png', { compressionLevel: 9 }),
  )
}

async function drawLotImage(name: string, lot: Lot, id: number) {
  name = `第${name}签`
  const canvas = createCanvas(460, 700)
  const ctx = await generateCanvas(canvas, 'lots-bg.png', [
    [95, 155],
    [230, 155],
    [350, 155],
  ])
  ctx.font = '25px'

  const { question, rank } = lot
  // 画 name
  ctx.fillStyle = '#711b0f'
  let { width } = ctx.measureText(name)
  for (let i = 0; i < name.length; i++) {
    ctx.fillText(name.charAt(i), 350, 255 + (i * width) / name.length)
  }
  const yPos = 295 + width
  width = ctx.measureText(rank).width
  for (let i = 0; i < rank.length; i++) {
    ctx.fillText(rank.charAt(i), 350, yPos + (i * width) / rank.length)
  }
  // 画question
  ctx.fillStyle = '#be0a13'
  width = ctx.measureText(question).width
  // 从右往左画，从上往下画
  const perWidth = width / question.length + 4
  const lineGap = 10
  let row = 0
  let column = 0
  for (let i = 0; i < question.length; i++) {
    const font = question.charAt(i)
    if (perWidth * row < 240) {
      row++
      ctx.fillText(
        font,
        292 - column * perWidth - lineGap * (column + 1),
        305 + row * perWidth,
      )
    } else {
      row = 0
      column++
    }
  }

  writeFileSync(
    join(DATA_PATH, `/images/genshin/almanac/${id}.png`),
    canvas.toBuffer('image/png', { compressionLevel: 9 }),
  )
}

export function getTodayTimestamp() {
  return new Date().setHours(0, 0, 0, 0)
}

export async function generateAlmanac() {
  const todayLuckMap = new Map<string, Almanac>()
  const keys = Object.keys(listData)
  while (todayLuckMap.size < 6) {
    const r = seedRandomList(keys)
    if (todayLuckMap.has(r)) {
      continue
    }
    todayLuckMap.set(r, listData[r])
  }
  try {
    await drawImage(todayLuckMap, getTodayTimestamp())
    return true
  } catch (e) {
    console.log(e)
    return false
  }
}

export async function generateLot(id: number) {
  const keys = Object.keys(lotsData)
  const r = seedRandomList(keys)
  const lot = lotsData[r]
  await drawLotImage(r, lot, id)
  return lot.answer
}
