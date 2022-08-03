import { existsSync } from 'fs'
import { join } from 'path'
import { ARTIFACTS_PATH, ASSET_PATH, ROOT_PATH } from 'framework/config'
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
import { genBase64Url, img2Base64 } from 'src/utils'
import { MainPropertyTypes, Position, SubPropertyTypes } from 'src/types'
import nodeHtmlToImage from 'node-html-to-image'

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
    const rateTemplate = readFileSync(
      join(ROOT_PATH, ASSET_PATH, './template/rate.handlebars'),
    ).toString('utf-8')
    // 字体
    const fontBase64 = readFileSync(
      join(ROOT_PATH, ASSET_PATH, './font/NotoSansSC-Regular.otf'),
    ).toString('base64')
    // 背景图片
    const backgroundBase64 = img2Base64(
      join(ROOT_PATH, ARTIFACTS_PATH, './background.png'),
      'png',
    )
    // 圣遗物图片路径
    let artifactPath = join(ROOT_PATH, ARTIFACTS_PATH, `${info.name}.png`)
    if (!existsSync(artifactPath)) {
      artifactPath = join(ROOT_PATH, ARTIFACTS_PATH, `default.png`)
    }
    const artifactBase64 = img2Base64(artifactPath, 'png')
    // 圣遗物属性
    const starBase64 = img2Base64(join(ROOT_PATH, ARTIFACTS_PATH, './star.png'), 'png')
    const { name, main_item, sub_item } = info
    const { main, sub, total } = scores
    const image = (await nodeHtmlToImage({
      html: rateTemplate,
      content: {
        fontBase64,
        backgroundBase64,
        artifactBase64,
        starBase64,
        name,
        main,
        sub,
        total,
        main_item,
        sub_item,
      },
      encoding: 'base64',
    })) as string
    return genBase64Url(image)
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
