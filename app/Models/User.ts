import { DateTime } from 'luxon'
import { BaseModel, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Administrator from './Administrator'
import Customer from './Customer'
import Guide from './Guide'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public email: string

  @column()
  public phone: string

  @column()
  public identification_number: string
  
  @column()
  public document_type: string

  @column.date()
  public birth_date: DateTime

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(()=> Administrator, {
    foreignKey: 'user_id',
  })
  public administrators: HasMany<typeof Administrator>

  @hasMany(()=> Customer, {
    foreignKey: 'user_id',
  })
  public customers: HasMany<typeof Customer>

  @hasMany(()=> Guide, {
    foreignKey: 'user_id',
  })
  public guides: HasMany<typeof Guide>
}
