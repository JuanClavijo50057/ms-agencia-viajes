import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Airline from './Airline'
import Vehicle from './Vehicle'

export default class Plane extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public airline_id: number
  @belongsTo(() => Airline,{ foreignKey: 'airline_id' })
  public airline: BelongsTo<typeof Airline>

  @belongsTo(() => Vehicle, { foreignKey: 'id' })
  public vehicle: BelongsTo<typeof Vehicle>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
