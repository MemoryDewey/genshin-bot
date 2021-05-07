import { writeFileSync } from 'fs'
import { join } from 'path'
import { DATA_PATH, ROOT_PATH } from '../../../framework/config'
import { createCanvas, loadImage } from 'canvas'
import { readFileSync } from 'fs'
import { MainItem, OcrResponse, SubItem } from 'src/interfaces'
import {
  MainNumberMaxProp,
  MainNumberWeightRate,
  MainPercentMaxProp,
  MainPercentWeightRate,
  SubNumberMaxProp,
  SubNumberWeightRate,
  SubPercentMaxProp,
  SubPercentWeightRate,
} from './constant'

export async function setRatedImage(
  info: OcrResponse,
  scores: {
    main: number
    sub: number
    total: number
  },
  id: number | string,
) {
  try {
    const canvas = createCanvas(641, 530)
    const ctx = canvas.getContext('2d')
    // 图片路径
    const artifactsPath = './src/assets/images/artifacts'
    // 背景图片路径
    const path = join(ROOT_PATH, artifactsPath, './background.png')
    let file = readFileSync(path)
    const img = await loadImage(file)
    // 圣遗物图片路径
    const artifact = join(ROOT_PATH, artifactsPath, `${info.name}.png`)
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
    ctx.font = 'bold 36px sans-serif'
    ctx.fillText(info.name, 32, 64)

    //圣遗物分数
    ctx.fillStyle = '#dbcfc0'
    ctx.font = '24px sans-serif'
    ctx.fillText(`最终得分`, 32, 108)
    ctx.fillText(`${scores.main} + ${scores.sub}`, 32, 145)
    ctx.fillStyle = 'gold'
    ctx.font = '90px sans-serif'
    ctx.fillText(`${scores.total}`, 32, 255)

    // 圣遗物属性
    const star = join(ROOT_PATH, artifactsPath, './star.png')
    const dot = join(ROOT_PATH, artifactsPath, './dot.png')
    file = readFileSync(star)
    const starImg = await loadImage(file)
    const dotImg = await loadImage(dot)
    // 主词条
    ctx.drawImage(starImg, 32, 300, 24, 24)
    ctx.fillStyle = '#495366'
    ctx.font = 'bold 28px sans-serif'
    ctx.fillText(info.main_item.name, 80, 325)
    ctx.fillText(info.main_item.value, 470, 325)
    // 副词条
    ctx.fillStyle = '#495366'
    ctx.font = 'bold 20px sans-serif'
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
    writeFileSync(
      join(DATA_PATH, `/images/genshin/rate/${id}.png`),
      canvas.toBuffer('image/png', { compressionLevel: 9 }),
    )
    return true
  } catch (e) {
    console.log(e)
    return false
  }
}

/**
 * 计算圣遗物主词条权重
 * @param prop 圣遗物主词条
 */
function calcMainPropWeight(prop: MainItem): number {
  const isPercent = prop.value.includes('%')
  const value = parseFloat(prop.value)
  if (isPercent) {
    if (value > MainPercentMaxProp[prop.type]) {
      return -1
    }
    return Math.floor((value * 100) / MainPercentWeightRate[prop.type]) / 100
  }
  if (value > MainNumberMaxProp[prop.type]) {
    return -1
  }
  return Math.floor((value * 100) / MainNumberWeightRate[prop.type]) / 100
}

/**
 * 计算圣遗物副词条权重
 * @param prop 副词条
 */
function calcSubPropWeight(prop: SubItem): number {
  const isPercent = prop.value.includes('%')
  const value = parseFloat(prop.value)
  if (isPercent) {
    if (value > SubPercentMaxProp[prop.type]) {
      return -1
    }
    return Math.floor((value * 100) / SubPercentWeightRate[prop.type]) / 100
  }
  if (value > SubNumberMaxProp[prop.type]) {
    return -1
  }
  return Math.floor((value * 100) / SubNumberWeightRate[prop.type]) / 100
}

/**
 * 获取圣遗物主词条分数
 * @param prop
 */
export function calcMainPropScore(prop: MainItem): number {
  const isPercent = prop.value.includes('%')
  const weight = calcMainPropWeight(prop)
  if (weight < 0 || isNaN(weight)) {
    return -1
  }
  let value = 0
  if (!isPercent && prop.type != 'em') {
    value = weight * 1.286173
  } else {
    switch (prop.type) {
      case 'atk':
      case 'cr':
      case 'cd':
      case 'phys':
      case 'pyro':
      case 'hydro':
      case 'elec':
      case 'geo':
      case 'anemo':
      case 'cryo':
        value = weight * 1.607717
        break
      case 'df':
      case 'em':
      case 'hp':
        value = weight * 1.446945
        break
      case 'heal':
      case 'er':
        value = weight * 1.286173
        break
    }
  }
  return Math.ceil(value * 100) / 100
}

export function calcSubPropScore(props: SubItem[]): number {
  let total = 0
  for (const prop of props) {
    const weight = calcSubPropWeight(prop)
    if (weight < 0 || isNaN(weight)) {
      return -1
    }
    const isPercent = prop.value.includes('%')
    if (!isPercent && prop.type != 'em') {
      total += weight * 1.139601
    } else {
      switch (prop.type) {
        case 'cd':
        case 'cr':
        case 'atk':
          total += weight * 1.424501424
          break
        case 'df':
        case 'hp':
        case 'em':
        case 'er':
          total += weight * 1.282051
          break
      }
    }
  }
  return Math.ceil(total * 100) / 100
}
