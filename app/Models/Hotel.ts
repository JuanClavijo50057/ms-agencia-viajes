import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import City from './City'
import Room from './Room'
import Car from './Car'
import Administrator from './Administrator'

export default class Hotel extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public address: string

  @column()
  public stars: number

  @column()
  public amenities: string

  @column()
  public city_id: number

  @column()
  public administrator_id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => City, {
    foreignKey: "city_id",
  })
  public city: BelongsTo<typeof City>;

  @belongsTo(() => Administrator, {
    foreignKey: "administrator_id",
  })
  public administrator: BelongsTo<typeof Administrator>;

  @hasMany(() => Room,{
    foreignKey: 'hotel_id'
  })
  public rooms: HasMany<typeof Room>

  @hasMany(() => Car,{
    foreignKey: 'hotel_id'
  })
  public cars: HasMany<typeof Car>
}
