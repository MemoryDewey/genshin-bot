import { Column, Entity } from 'typeorm'
import { Base } from './base'

@Entity()
export class Lottery extends Base {
  @Column()
  qq: number

  @Column()
  active: boolean
}
