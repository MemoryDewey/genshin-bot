import { Column, Entity } from 'typeorm'
import { Base } from './base'

@Entity()
export class Lots extends Base {
  @Column()
  timestamp: number

  @Column()
  lotAnswer: string

  @Column()
  path: string
}
