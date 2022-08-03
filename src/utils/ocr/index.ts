import { pieceRef } from './data/translation'
import { SET_NAME, SLOT_NAME } from './data/artifacts'
import { guessWith } from './parse/helper'
import guessMainStat from './parse/guessMainStat'
import guessSubStats from './parse/guessSubStats'
import guessEnhancement from './parse/guessEnhancement'
import { FindTextRegions, Marvin, MarvinImage } from 'lib/marvinj'
import { preprocessArtifact } from './preprocessing'
import getOcr, { OcrOptions } from './ocr'
import guessRarity from './parse/guessRarity'
import { RecognizeResult } from 'tesseract.js'

const guessPieceName = guessWith(
  Object.values(pieceRef).flatMap(artifact => Object.values(artifact)),
  1,
)
const guessSetName = guessWith(SET_NAME, 1)
const guessSlotName = guessWith(SLOT_NAME, 1)

export const parseArtifact = (
  topData: RecognizeResult,
  botData: RecognizeResult,
  setData: RecognizeResult,
) => {
  const mainStat = guessMainStat(topData)
  const subStats = guessSubStats(botData)
  const set = guessSetName(setData)
  const slot = guessSlotName(topData)
  const piece = guessPieceName(topData)

  return { mainStat, subStats, set, slot, piece }
}

type Options = { onProgress?: OcrOptions['onProgress'] }
export const artifactOcr = async (imageData: string, options: Options = {}) => {
  console.time('Marvin')
  const marvinLoad = (url: string): Promise<MarvinImage> => {
    return new Promise(resolve => {
      const img = new MarvinImage()
      img.load(url, () => {
        resolve(img)
      })
    })
  }
  const image = await marvinLoad(imageData)
  const processed = Object.values(preprocessArtifact(image))
  console.timeEnd('Marvin')
  console.time('Ocr')
  const [topRes, botRes, setRes] = await Promise.all(
    processed.map(data =>
      getOcr(data, {
        onProgress: options.onProgress,
      }),
    ),
  )
  console.timeEnd('Ocr')
  const parse = parseArtifact(topRes, botRes, setRes)
  const rarity = guessRarity(image)
  const enhancement = guessEnhancement(parse.mainStat.value, rarity)
  return Promise.resolve({ ...parse, rarity, enhancement })
}
