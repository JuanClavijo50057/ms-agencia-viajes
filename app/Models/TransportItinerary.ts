import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Travel from './Travel'

export default class TransportItinerary extends BaseModel {
  @column({ isPrimary: true })
  public id: number
  
  @column()
  public sequence: number

  @column()
  public travelId: number

  @column()
  public journeyId: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Travel, {
    foreignKey: 'travelId'
  })
  public travel: BelongsTo<typeof Travel>

  @belongsTo(() => Travel, {
    foreignKey: 'journeyId'
  })
  public journey: BelongsTo<typeof Travel>
}
