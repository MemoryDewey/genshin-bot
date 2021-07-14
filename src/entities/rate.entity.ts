import { Column, Entity } from 'typeorm'
import { Base } from './base'
import { OcrResponse } from '../interfaces'

@Entity()
export class Rate extends Base {
  @Column()
  dataStr: string

  get data(): OcrResponse {
    return JSON.parse(this.dataStr) as OcrResponse
  }

  constructor(id: number, data: OcrResponse) {
    super()
    this.id = id
    this.dataStr = JSON.stringify(data)
  }
}
