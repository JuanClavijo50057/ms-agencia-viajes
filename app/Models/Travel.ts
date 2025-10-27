import { DateTime } from 'luxon'
import { BaseModel, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Quota from './Quota'
import TravelCustomer from './TravelCustomer'

export default class Travel extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public description: string

  @column.date()
  public creationDate: DateTime

  @column.date()
  public startDate: DateTime

  @column.date()
  public endDate: DateTime

  @column()
  public price: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => Quota, {
    foreignKey: 'travel_id'
  })
  public quotas: HasMany<typeof Quota>

  @hasMany(() => TravelCustomer, {
    foreignKey: 'travel_id'
  })
  public travelCustomers: HasMany<typeof TravelCustomer>
}
