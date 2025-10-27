import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import BankCard from './BankCard'
import Quota from './Quota'

export default class Bill extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public amount: number

  @column.date()
  public due_date: DateTime
  
  @column()
  public description: string | null

  @column()
  public bank_card_id: number
  
  @column()
  public quota_id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(()=> BankCard, {
    foreignKey: 'bank_card_id'
  })
  public bankCard: BelongsTo<typeof BankCard>

  @belongsTo(() => Quota, {
    foreignKey: 'quota_id'
  })
  public quota: BelongsTo<typeof Quota>
}
