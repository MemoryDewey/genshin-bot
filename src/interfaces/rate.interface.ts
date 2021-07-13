import { MainPropertyTypes, Position, SubPropertyTypes } from 'src/types'
import { BaseDb } from './base'

export interface RateError {
  message: string
  code: number
}

export interface MainItem {
  type: keyof typeof MainPropertyTypes
  name: string
  value: string
}

export interface SubItem {
  type: keyof typeof SubPropertyTypes
  name: string
  value: string
}

export interface OcrResponse {
  name: string
  pos: Position
  star: number
  level: number
  main_item: MainItem
  sub_item: SubItem[]
}

export interface RateDB extends BaseDb {
  response: OcrResponse
}
