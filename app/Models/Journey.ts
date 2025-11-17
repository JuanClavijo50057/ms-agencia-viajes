import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import City from './City'

export default class Journey extends BaseModel {
  @column({ isPrimary: true })
  public id: number
  @column()
  public origin_id: number
  @column()
  public destination_id: number

  @belongsTo(() => City, { foreignKey: 'origin_id' })
  public origin: BelongsTo<typeof City>

  @belongsTo(() => City, { foreignKey: 'destination_id' })
  public destination: BelongsTo<typeof City>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
