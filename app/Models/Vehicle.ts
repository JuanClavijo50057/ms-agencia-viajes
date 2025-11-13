import { DateTime } from 'luxon'
import { BaseModel, column, HasMany, hasMany, HasOne, hasOne } from '@ioc:Adonis/Lucid/Orm'
import Gps from './Gps'
import Shift from './Shift'

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

  @hasMany(() => Shift, {
    foreignKey: 'vehicle_id',
  })
  public shifts: HasMany<typeof Shift>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
