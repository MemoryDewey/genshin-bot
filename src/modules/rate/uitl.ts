import { existsSync } from 'fs'
import { join } from 'path'
import { ARTIFACTS_PATH, ROOT_PATH } from 'framework/config'
import { createCanvas, loadImage, registerFont } from 'canvas'
import { readFileSync } from 'fs'
import { MainItem, OcrResponse, SubItem } from 'src/interfaces'
import {
  SubAtkRate,
  SubCriRate,
  SubNumberMaxProp,
  SubNumberRate,
  SubPercentMaxProp,
  SubPercentRate,
} from './constant'
import { logger } from 'framework/utils'
import { canvas2Base64 } from 'src/utils'
import { MainPropertyTypes, Position, SubPropertyTypes } from 'src/types'

/**
 * 设置圣遗物评分图片
 * @param info
 * @param scores
 */
export async function genRatedImage(
  info: OcrResponse,
  scores: {
    main: number
    sub: number
    total: number
  },
) {
  try {
    const fontPath = join(ROOT_PATH, './src/assets/font/NotoSansSC-Regular.otf')
    registerFont(fontPath, { family: 'Sans' })
    const canvas = createCanvas(641, 530)
    const ctx = canvas.getContext('2d')
    // 背景图片路径
    const path = join(ROOT_PATH, ARTIFACTS_PATH, './background.png')
    let file = readFileSync(path)
    const img = await loadImage(file)
    // 圣遗物图片路径
    let artifact = join(ROOT_PATH, ARTIFACTS_PATH, `${info.name}.png`)
    if (!existsSync(artifact)) {
      artifact = join(ROOT_PATH, ARTIFACTS_PATH, `default.png`)
    }
    file = readFileSync(artifact)
    const artifactImg = await loadImage(file)
    // 画背景
    ctx.drawImage(img, 0, 0, 641, 275)
    ctx.fillStyle = '#ece5d8'
    ctx.fillRect(0, 275, 640, 256)
    // 画圣遗物图片
    ctx.drawImage(artifactImg, 420, 45, 175, 175)
    // 画文字
    // 圣遗物名称
    ctx.textBaseline = 'bottom'
    ctx.fillStyle = '#dbac70'
    ctx.font = 'bold 36px Sans'
    ctx.fillText(info.name, 32, 64)

    //圣遗物分数
    ctx.fillStyle = '#dbcfc0'
    ctx.font = '24px Sans'
    ctx.fillText(`最终得分`, 32, 108)
    ctx.fillText(`${scores.main.toFixed(2)} + ${scores.sub.toFixed(2)}`, 32, 145)
    ctx.fillStyle = 'gold'
    ctx.font = '90px Sans'
    ctx.fillText(`${scores.total.toFixed(2)}`, 32, 255)

    // 圣遗物属性
    const star = join(ROOT_PATH, ARTIFACTS_PATH, './star.png')
    const dot = join(ROOT_PATH, ARTIFACTS_PATH, './dot.png')
    file = readFileSync(star)
    const starImg = await loadImage(file)
    const dotImg = await loadImage(dot)
    // 主词条
    ctx.drawImage(starImg, 32, 300, 24, 24)
    ctx.fillStyle = '#495366'
    ctx.font = 'bold 28px Sans'
    ctx.fillText(info.main_item.name, 80, 325)
    ctx.fillText(info.main_item.value, 470, 325)
    // 副词条
    ctx.fillStyle = '#495366'
    ctx.font = 'bold 20px Sans'
    ctx.drawImage(dotImg, 35, 345, 16, 16)
    ctx.fillText(info.sub_item[0].name, 80, 365)
    ctx.fillText(info.sub_item[0].value, 470, 365)
    ctx.drawImage(dotImg, 35, 390, 16, 16)
    ctx.fillText(info.sub_item[1].name, 80, 410)
    ctx.fillText(info.sub_item[1].value, 470, 410)
    ctx.drawImage(dotImg, 35, 435, 16, 16)
    ctx.fillText(info.sub_item[2].name, 80, 455)
    ctx.fillText(info.sub_item[2].value, 470, 455)
    ctx.drawImage(dotImg, 35, 480, 16, 16)
    ctx.fillText(info.sub_item[3].name, 80, 500)
    ctx.fillText(info.sub_item[3].value, 470, 500)
    return canvas2Base64(canvas)
  } catch (e) {
    logger.error(e.toString())
    return false
  }
}

/**
 * 是否为合法的副词条
 * @param prop 副词条
 */
function isLegalSubItem(prop: SubItem): boolean {
  const isPercent = prop.value.includes('%')
  const value = parseFloat(prop.value)
  if (isPercent) {
    return value <= SubPercentMaxProp[prop.type]
  }
  return value <= SubNumberMaxProp[prop.type]
}

/**
 * 获取圣遗物主词条分数
 * @param prop
 * @param pos
 */
export function calcMainPropScore(prop: MainItem, pos: Position): number {
  let value = 0
  switch (pos) {
    case '理之冠':
      switch (prop.type) {
        case 'cr':
        case 'cd':
          value = 10
          break
        case 'atk':
          value = 8
          break
        default:
          value = 2
      }
      break
    case '空之杯':
      switch (prop.type) {
        case 'phys':
        case 'pyro':
        case 'hydro':
        case 'elec':
        case 'geo':
        case 'anemo':
        case 'cryo':
          value = 10
          break
        case 'atk':
          value = 5
          break
        default:
          value = 2
      }
      break
    case '时之沙':
      switch (prop.type) {
        case 'atk':
          value = 10
          break
        default:
          value = 2
      }
      break
    case '死之羽':
    case '生之花':
      value = 6
  }
  return value
}

function getDefaultSubScore(
  value: number,
  isPercent: boolean,
  type: keyof typeof SubPropertyTypes,
) {
  return isPercent ? value / SubPercentRate[type] : value / SubNumberRate[type]
}

function getAtkSubScore(
  value: number,
  isPercent: boolean,
  type: keyof typeof SubPropertyTypes,
) {
  if (['er', 'em'].includes(type)) {
    return value / SubAtkRate[type]
  }
  return getDefaultSubScore(value, isPercent, type)
}

export function calcSubPropScore(
  props: SubItem[],
  mainType: keyof typeof MainPropertyTypes,
  pos: Position,
): number {
  let total = 0
  for (const prop of props) {
    if (!isLegalSubItem(prop)) {
      return -1
    }
    const isPercent = prop.value.includes('%')
    const value = parseFloat(prop.value)
    switch (pos) {
      case '理之冠':
        switch (mainType) {
          case 'cr':
          case 'cd':
            if (['cd', 'cr'].includes(prop.type)) {
              total += value / SubCriRate[prop.type]
              break
            }
            total += getDefaultSubScore(value, isPercent, prop.type)
            break
          case 'atk':
            total += getAtkSubScore(value, isPercent, prop.type)
            break
          default:
            total += getDefaultSubScore(value, isPercent, prop.type)
        }
        break
      case '空之杯':
        switch (mainType) {
          case 'phys':
          case 'pyro':
          case 'hydro':
          case 'elec':
          case 'geo':
          case 'anemo':
          case 'cryo':
            total += getDefaultSubScore(value, isPercent, prop.type)
            break
          case 'atk':
            total += getAtkSubScore(value, isPercent, prop.type)
            break
          default:
            total += getDefaultSubScore(value, isPercent, prop.type)
        }
        break
      case '时之沙':
        switch (mainType) {
          case 'atk':
            total += getAtkSubScore(value, isPercent, prop.type)
            break
          default:
            total += getDefaultSubScore(value, isPercent, prop.type)
        }
        break
      case '死之羽':
      case '生之花':
        total += getDefaultSubScore(value, isPercent, prop.type)
    }
  }
  return Math.ceil(total * 100) / 100
}
