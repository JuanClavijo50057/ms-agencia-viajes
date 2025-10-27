import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Hotel from './Hotel'

export default class Administrator extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public user_id: number

  @column()
  public active: 'Y' | 'N'

  @column.dateTime()
  public hire_date: DateTime

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => Hotel, {
    foreignKey: 'administrator_id',
  })
  public hotels: HasMany<typeof Hotel>

  @belongsTo(()=> User,{
    foreignKey: 'user_id',
  })
  public user: BelongsTo<typeof User>
}
