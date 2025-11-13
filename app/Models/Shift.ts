import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Driver from './Driver'
import Vehicle from './Vehicle'

export default class Shift extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column.date()
  public start_time: DateTime

  @column.date()
  public end_time: DateTime
  @column()
  public driver_id: number
  
  @column()
  public vehicle_id: number

  @belongsTo(() => Driver,
    { foreignKey: 'driver_id' })
  public driver: BelongsTo<typeof Driver>
  @belongsTo(() => Vehicle, {
    foreignKey: 'vehicle_id', 
  })
  public vehicle: BelongsTo<typeof Vehicle>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
