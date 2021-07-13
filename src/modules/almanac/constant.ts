import { readJsonFile } from 'src/utils'
import path from 'path'
import { BaseDb } from 'src/interfaces'

export type Almanac = {
  buff: string[]
  debuff: string[]
}

export type Almanacs = {
  [key: string]: Almanac
}

export interface AlmanacsStore {
  timestamp: number
  path: string
}

export type Lot = {
  answer: string
  question: string
  rank: string
}

export type Lots = {
  [key: string]: Lot
}

export interface LotsStore {
  timestamp: number
  lotAnswer: string
  path: string
}

export interface AlmanacDB extends BaseDb {
  result: LotsStore | AlmanacsStore
}

export const chineseMap = ['', '一', '二', '三', '四', '五', '六', '七', '八', '九']

export const listData = readJsonFile<Almanacs>(path.join(__dirname, 'almanac-list.json'))

export const lotsData = readJsonFile<Lots>(path.join(__dirname, 'lots-list.json'))
