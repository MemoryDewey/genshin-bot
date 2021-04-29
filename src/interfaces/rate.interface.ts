import { PropertyTypes } from 'src/types'

export interface RateError {
  message: string
  code: number
}

export interface MainItem {
  type: keyof PropertyTypes
  name: string
  value: string
}

export interface SubItem {
  type: keyof PropertyTypes
  name: string
  value: string
}

export interface OcrResponse {
  name: string
  pos: string
  star: number
  level: number
  main_item: MainItem
  sub_item: SubItem[]
}

export interface RateResponse {
  total_score: number
  total_percent: string
  main_score: number
  main_percent: string
  sub_score: number
  sub_percent: string
}
