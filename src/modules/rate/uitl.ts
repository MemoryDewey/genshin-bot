import { writeFileSync } from 'fs'
import { join } from 'path'
import { DATA_PATH, ROOT_PATH } from 'framework/config'
import { createCanvas, loadImage } from 'canvas'
import { readFileSync } from 'fs'
import { MainItem, SubItem } from 'src/interfaces'
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
  if (weight < 0) {
    return weight
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
    if (weight < 0) {
      return weight
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
