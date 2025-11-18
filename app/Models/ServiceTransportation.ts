import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Vehicle from './Vehicle'
import Journey from './Journey'
import TransportItinerary from './TransportItinerary'

export default class ServiceTransportation extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column.date()
  public start_date: DateTime

  @column.date()
  public end_date: DateTime

  @column()
  public cost: number

  @column()
  public transportation_id: number

  @column()
  public journey_id: number

  @belongsTo(() => Vehicle, {
    foreignKey: 'transportation_id',
  })
  public vehicle: BelongsTo<typeof Vehicle>

  @belongsTo(() => Journey, {
    foreignKey: 'journey_id',
  })
  public journey: BelongsTo<typeof Journey>

  @hasMany(() => TransportItinerary, {
    foreignKey: 'service_transportation_id',
  })
  public transportItineraries: HasMany<typeof TransportItinerary>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
