import { Almanac, chineseMap, listData } from './constant'
import { join } from 'path'
import { DATA_PATH, ROOT_PATH } from 'framework/config'
import { readFileSync, writeFileSync } from 'fs'
import { createCanvas, loadImage, registerFont } from 'canvas'

function number2chinese(num: number) {
  if (num < 10) {
    return chineseMap[num]
  } else {
    const floor = Math.floor(num / 10)
    return `${chineseMap[floor > 1 ? floor : 0]}十${chineseMap[num % 10]}`
  }
}

/**
 * 使用随机种子随机选择列表中的元素
 * @param arr
 */
function seedRandomList(arr: string[]) {
  const index = Math.floor(Math.random() * arr.length)
  return arr[index]
}

async function drawImage(buffMap: Map<string, Almanac>, id: number) {
  const date = new Date(getTodayTimestamp())

  const year = date.getFullYear().toString()
  const month = `${chineseMap[date.getMonth() + 1]}月`
  const day = number2chinese(date.getDate())

  const canvas = createCanvas(525, 580)
  const ctx = canvas.getContext('2d')

  const fontPath = join(ROOT_PATH, './src/assets/font/Hans.ttf')
  registerFont(fontPath, { family: 'Hans' })
  // 图片路径
  const artifactsPath = './src/assets/images/almanac'
  // 背景图片路径
  const path = join(ROOT_PATH, artifactsPath, './back.png')
  const file = readFileSync(path)
  const img = await loadImage(file)

  ctx.drawImage(img, 0, 0, 525, 580)

  ctx.textBaseline = 'bottom'
  ctx.textAlign = 'center'
  ctx.font = '30px Hans'
  // year
  ctx.fillStyle = '#8d7650'
  ctx.fillText(year, 118, 182)
  // day
  ctx.fillStyle = '#f7f8f2'
  ctx.fillText(day, 260, 182)
  // month
  ctx.fillStyle = '#8d7650'
  ctx.fillText(month, 410, 182)

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

export function getTodayTimestamp() {
  return new Date().setHours(0, 0, 0, 0)
}

export async function generateAlmanac(id: number) {
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
    await drawImage(todayLuckMap, id)
    return true
  } catch (e) {
    console.log(e)
    return false
  }
}
