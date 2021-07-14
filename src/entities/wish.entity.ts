import { Column, Entity } from 'typeorm'
import { Base } from './base'
import { ListItem } from 'src/interfaces'

@Entity()
export class Wish extends Base {
  @Column()
  dataStr: string

  @Column()
  name: string

  get data(): ListItem[] {
    return JSON.parse(this.dataStr) as ListItem[]
  }

  setData(data: ListItem[]) {
    this.dataStr = JSON.stringify(data)
  }

  constructor(id: number, name: string, data: ListItem[]) {
    super()
    this.id = id
    this.name = name
    this.dataStr = JSON.stringify(data)
  }
}
