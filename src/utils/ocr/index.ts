import { pieceRef, Slot } from './data/translation'
import { SET_NAME, SLOT_NAME } from './data/artifacts'
import { guessWith } from './parse/helper'
import guessMainStat, { Stat } from './parse/guessMainStat'
import guessSubStats from './parse/guessSubStats'
import guessEnhancement from './parse/guessEnhancement'
import { MarvinImage } from 'lib/marvinj'
import { preprocessArtifact } from './preprocessing'
import getOcr, { OcrOptions } from './ocr'
import guessRarity, { Rarity } from './parse/guessRarity'
import { RecognizeResult } from 'tesseract.js'

const guessPieceName = guessWith(
  Object.values(pieceRef).flatMap(artifact => Object.values(artifact)),
  1,
)
const guessSetName = guessWith(SET_NAME, 1)
const guessSlotName = guessWith<Slot>(SLOT_NAME, 1)

export function parseArtifact(
  topData: RecognizeResult,
  botData: RecognizeResult,
  setData: RecognizeResult,
) {
  const mainStat = guessMainStat(topData)
  const subStats = guessSubStats(botData)
  const set = guessSetName(setData)
  const slot = guessSlotName(topData)
  const piece = guessPieceName(topData)

  return { mainStat, subStats, set, slot, piece }
}

export interface OcrResponse {
  mainStat: Stat
  subStats: Stat[]
  set: string
  slot: Slot
  piece: string
  rarity: Rarity
  enhancement: number
}

type Options = { onProgress?: OcrOptions['onProgress'] }
export async function artifactOcr(
  imageData: string,
  options: Options = {},
): Promise<OcrResponse> {
  console.time('Marvin Deal Image:')
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
  console.timeEnd('Marvin Deal Image:')
  console.time('Ocr Image:')
  const [topRes, botRes, setRes] = await Promise.all(
    processed.map(data =>
      getOcr(data, {
        onProgress: options.onProgress,
      }),
    ),
  )
  console.timeEnd('Ocr Image:')
  const parse = parseArtifact(topRes, botRes, setRes)
  const rarity = guessRarity(image)
  const enhancement = guessEnhancement(parse.mainStat.value, rarity)
  return Promise.resolve({ ...parse, rarity, enhancement })
}
