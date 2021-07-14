import { Base } from './base'
import { Column, Entity } from 'typeorm'

@Entity()
export class Almanac extends Base {
  @Column()
  timestamp: number

  @Column()
  path: string
}
