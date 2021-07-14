import { Column, Entity } from 'typeorm'
import { Base } from './base'

@Entity()
export class Lottery extends Base {
  @Column()
  active: boolean
}
