import { DateTime } from 'luxon'
import { BaseModel, belongsTo, BelongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import City from './City'

export default class TouristActivity extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public description: string | null

  @column()
  public city_id: number

  @column()
  public price: number | null

  @column()
  public is_active: boolean

  @belongsTo(() => City, {
      foreignKey: "city_id",
  })
  public city: BelongsTo<typeof City>;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
