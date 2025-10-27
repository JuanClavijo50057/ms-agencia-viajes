import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column, HasOne, hasOne } from '@ioc:Adonis/Lucid/Orm'
import Travel from './Travel'
import Bill from './Bill'

export default class Quota extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public amount: number

  @column()
  public number_payments: number

  @column()
  public travel_id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Travel, { 
    foreignKey: 'travel_id'
  })
  public travel: BelongsTo<typeof Travel>

  @hasOne(() => Bill, {
    foreignKey: 'quota_id',
  })
  public bill: HasOne<typeof Bill>
}
