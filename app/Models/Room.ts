import { DateTime } from 'luxon'
import { BaseModel, belongsTo, BelongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Hotel from './Hotel'

export default class Room extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public room_number: string

  @column()
  public price_per_night: number

  @column()
  public is_available: boolean

  @column()
  public hotel_id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Hotel, {
      foreignKey: "hotel_id", // Foreign key on the hotel model
    })
    public hotel: BelongsTo<typeof Hotel>;
}
