import { readJsonFile } from 'src/utils'
import { Dictionary } from 'src/interfaces'
import path from 'path'

const dictionary = readJsonFile<Dictionary>(path.join(__dirname, 'dictionary.json'))
const QiuQiuWord = dictionary.word
const QiuQiuPhrase = dictionary.phrase

/**
 * 比对word库是否有匹配的单词，有的话返回翻译，没有返回原词
 * @param word
 */
function compareWord(word: string) {
  if (Object.keys(QiuQiuWord).includes(word)) {
    return QiuQiuWord[word]
  }
  return word
}

/**
 * 比对phrase库是否有匹配的单词，有的话返回翻译，没有的话匹配word库，都没有返回原词
 * @param phrase
 */
function comparePhrase(phrase: string) {
  if (Object.keys(QiuQiuPhrase).includes(phrase)) {
    return QiuQiuPhrase[phrase]
  }
  return compareWord(phrase)
}

export function qiuQiuWordTranslation(textList: string[]) {
  let mes = '你查询的的丘丘语意思为:\n'
  for (let word of textList) {
    word = word.toLowerCase()
    const traWord = compareWord(word)
    if (traWord == word) {
      // 如果是原词表示没有翻译，前后加空格接回语句里
      mes = `${mes} ${traWord} `
    } else {
      mes += traWord
    }
  }
  return mes
}

export function qiuQiuPhraseTranslation(phrase: string) {
  // 语句翻译，先看phrase库是不是有匹配的语句
  // 没有的话把单词拆开返回单词的意思
  phrase = phrase.toLowerCase()
  const traPhrase = comparePhrase(phrase)
  if (traPhrase != phrase) {
    return `你查询的的丘丘语意思为:\n${traPhrase}\n`
  }
  const textList = phrase.split(' ')
  let mes = '没有查到这句丘丘语,以下是单词的翻译\n'
  for (const word of textList) {
    if (word == ' ') {
      continue
    }
    const traWord = comparePhrase(word)
    if (traWord == word) {
      mes += `${word} : 没有这个词的翻译\n`
    } else {
      mes += `${word} : ${traWord}\n`
    }
  }
  return mes
}
