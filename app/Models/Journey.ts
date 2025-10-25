import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column, hasMany } from '@ioc:Adonis/Lucid/Orm'

export default class Journey extends BaseModel {
  @column({ isPrimary: true })
  public id: number
  @column()
  public originId: number
  @column()
  public destinationId: number

  @belongsTo(() => Journey, { foreignKey: 'origin_id' })
  public origin: BelongsTo<typeof Journey>
  @belongsTo(() => Journey, { foreignKey: 'destination_id' })
  public destination: BelongsTo<typeof Journey>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
