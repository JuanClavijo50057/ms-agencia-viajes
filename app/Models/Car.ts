import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column, HasOne, hasOne } from '@ioc:Adonis/Lucid/Orm'
import Vehicle from './Vehicle'
import Gps from './Gps'
import Hotel from './Hotel'

export default class Car extends BaseModel {
  @column({ isPrimary: true })
  public id: number
  @column()
  public license_plate: string
  @column()
  public hotel_id: number
  
  @hasOne(() => Gps, { foreignKey: 'vehicle_id' })
  public gps: HasOne<typeof Gps>

  @belongsTo(() => Vehicle, { foreignKey: 'id' })
  public vehicle: BelongsTo<typeof Vehicle>
  
  @belongsTo(() => Hotel, { foreignKey: 'hotel_id' })
  public hotel: BelongsTo<typeof Hotel>
  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
