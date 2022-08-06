import {
  getValueType,
  guessWith,
  matchNumbers,
  parseStatKey,
  removeGarbo,
  ValueType,
} from './helper'
import { StatKey, statRef } from '../data/translation'
import { RecognizeResult } from 'tesseract.js'

export interface Stat {
  key: StatKey
  name: string
  value: number
  type: ValueType
}

const guessMainStatValue = (data: RecognizeResult) => {
  return data.data.lines
    .sort((a, b) => {
      return b.confidence - a.confidence
    })
    .map(line => {
      const text = removeGarbo(line.text)
      const matches = matchNumbers(text)
      if (matches) return matches[0]
      return matches
    })
    .filter((match): match is string => match !== null)
}

const guessMainStatKey = guessWith(Object.values(statRef).map(a => a.chs))

export const guessMainStat: (data: RecognizeResult) => Stat = data => {
  const value = guessMainStatValue(data)
  const name = guessMainStatKey(data) ?? ''
  const type = getValueType(value[0])
  const approx = parseStatKey(name)

  return { key: approx?.key, name: approx?.name, value: parseFloat(value[0]), type }
}

export default guessMainStat
