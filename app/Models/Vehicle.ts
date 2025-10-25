import { DateTime } from 'luxon'
import { BaseModel, column, HasOne, hasOne } from '@ioc:Adonis/Lucid/Orm'
import Gps from './Gps'

export default class Vehicle extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public brand: string

  @column()
  public type: 'carro' | 'aeronave'

  @column()
  public model: number

  @column()
  public color: string

  @column()
  public capacity: number

  @column()
  public gps_id: number

  @hasOne(() => Gps,
    { foreignKey: 'vehicle_id' })
  public gps: HasOne<typeof Gps>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
