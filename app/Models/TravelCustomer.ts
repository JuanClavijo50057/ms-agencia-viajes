import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Customer from './Customer'
import Travel from './Travel'

export default class TravelCustomer extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public travel_id: number

  @column()
  public customer_id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Customer, { 
    foreignKey: 'customer_id'
  })
  public customer: BelongsTo<typeof Customer>

  @belongsTo(() => Travel, {
    foreignKey: 'travel_id'
  })
  public travel: BelongsTo<typeof Travel>
}
