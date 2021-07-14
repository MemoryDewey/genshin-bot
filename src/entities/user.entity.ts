import { Column, Entity } from 'typeorm'
import { Base } from './base'
import { WishParam } from 'src/types'

@Entity()
export class User extends Base {
  @Column()
  wishParamStr: string

  get wishParam(): WishParam {
    return JSON.parse(this.wishParamStr) as WishParam
  }

  constructor(id: number, data: WishParam) {
    super()
    this.id = id
    this.wishParamStr = JSON.stringify(data)
  }
}
