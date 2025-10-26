import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Department from './Department'
import Journey from './Journey'
import Hotel from './Hotel'
import TouristActivity from './TouristActivity'

export default class City extends BaseModel {
  @column({ isPrimary: true })
  public id: number
  @column()
  public name: string
  @column()
  public department_id: number

  @belongsTo(() => Department,
    { foreignKey: 'department_id' })
  public department: BelongsTo<typeof Department>

  @hasMany(() => Journey, { foreignKey: 'origin_id' })
  public originJourneys: HasMany<typeof Journey>

  @hasMany(() => Journey, { foreignKey: 'destination_id' })
  public destinationJourneys: HasMany<typeof Journey>

  @hasMany(() => Hotel, { foreignKey: 'city_id' })
  public hotels: HasMany<typeof Hotel>

  @hasMany(() => TouristActivity, { foreignKey: 'city_id' })
  public touristActivities: HasMany<typeof TouristActivity>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
