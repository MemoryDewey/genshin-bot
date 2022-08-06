// match spaces and irrelevant special chars
import { Language, StatKey, statRef } from '../data/translation'
import { hammingDistance } from '../hammingDistance'
import { RecognizeResult } from 'tesseract.js'

const garboRegex = new RegExp(/(\s|[-!$^&*()_|~=`{}\[\]:";<>?,\/\\|↵，、【】])/g)
// match numbers and numbers ending in percentage sign
const numberRegex = new RegExp(/(?:\d*\.)?\d+%|(?:\d*\.)?\d+/)

export const removeGarbo = (text: string) => text.replace(garboRegex, '')
export const matchNumbers = (text: string) => text.match(numberRegex)

export type ValueType = 'percent' | 'flat'
export const getValueType: (value: string) => ValueType = value =>
  value.endsWith('%') ? 'percent' : 'flat'

export const parseStatKey = (key: string, language: Language = 'chs') => {
  const entry = Object.entries(statRef).find(([_, value]) => {
    return hammingDistance(value[language], key) <= 1
  })
  if (entry !== undefined) {
    return { key: entry[0] as StatKey, name: entry[1][language] }
  }
  // undefined is returned if no match
}

export const guessWith =
  <T extends string>(ref: string[], maxDistance = 0) =>
  (data: RecognizeResult) => {
    // should change to filter to return list of possible matches
    return ref.find(name => {
      return data.data.lines
        .map(line => removeGarbo(line.text))
        .some(text => {
          if (text === '') return false
          return hammingDistance(text, name) <= maxDistance
        })
    }) as T
  }
