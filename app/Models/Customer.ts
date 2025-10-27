import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import BankCard from './BankCard'
import TravelCustomer from './TravelCustomer'

export default class Customer extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public user_id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => User, { 
    foreignKey: 'user_id'
  })
  public user: BelongsTo<typeof User>

  @hasMany(() => BankCard, {
    foreignKey: 'customer_id',
  })
  public bankCards: HasMany<typeof BankCard>

  @hasMany(() => TravelCustomer, {
    foreignKey: 'customer_id',
  })
  public travelCustomers: HasMany<typeof TravelCustomer>
}
