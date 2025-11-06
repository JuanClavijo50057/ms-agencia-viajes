import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Travel from './Travel'
import ServiceTransportation from './ServiceTransportation'

export default class TransportItinerary extends BaseModel {
  @column({ isPrimary: true })
  public id: number
  
  @column()
  public sequence: number

  @column()
  public travel_id: number

  @column()
  public journey_id: number

  @column()
  public service_transportation_id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Travel, {
    foreignKey: 'travel_id'
  })
  public travel: BelongsTo<typeof Travel>

  @belongsTo(() => Travel, {
    foreignKey: 'journey_id'
  })
  public journey: BelongsTo<typeof Travel>

  @belongsTo(() => ServiceTransportation, {
    foreignKey: 'service_transportation_id'
  })
  public serviceTransportation: BelongsTo<typeof ServiceTransportation>
}
