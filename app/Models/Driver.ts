import { DateTime } from 'luxon'
import { BaseModel, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Shift from './Shift'

export default class Driver extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public user_id: string
  
  @column()
  public experience: number

  @hasMany(() => Shift, {
    foreignKey: 'driver_id',
  })
  public shifts: HasMany<typeof Shift>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
