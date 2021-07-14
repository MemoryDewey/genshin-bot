import { BaseEntity, PrimaryColumn } from 'typeorm'

export abstract class Base extends BaseEntity {
  @PrimaryColumn()
  id: number
}
