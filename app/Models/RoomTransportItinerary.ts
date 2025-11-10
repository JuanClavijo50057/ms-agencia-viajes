import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Room from './Room'
import TransportItinerary from './TransportItinerary'

export default class RoomTransportItinerary extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public room_id: number

  @column()
  public transport_itinerary_id: number

  @belongsTo(() => Room, {
    foreignKey: 'room_id',
  })
  public room: BelongsTo<typeof Room>

  @belongsTo(() => TransportItinerary, {
    foreignKey: 'transport_itinerary_id',
  })
  public transportItinerary: BelongsTo<typeof TransportItinerary>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
