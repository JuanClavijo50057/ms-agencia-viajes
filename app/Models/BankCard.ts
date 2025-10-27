import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Customer from './Customer'
import Bill from './Bill'

export default class BankCard extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public card_type: 'debit' | 'credit'

  @column()
  public provider: string

  @column()
  public card_number: string

  @column()
  public card_holder: string

  @column.date()
  public expiration_date: DateTime

  @column()
  public cvv: string
  
  @column()
  public status: 'active' | 'inactive' | 'blocked'

  @column()
  public is_default: boolean
  
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

  @hasMany(() => Bill, {
    foreignKey: 'bank_card_id',
  })
  public bills: HasMany<typeof Bill>
}
