import { DateTime } from 'luxon'
import { BaseModel, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import PlanTouristActivity from './PlanTouristActivity'
import PlanTravel from './PlanTravel'

export default class Plan extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public description: string | null

  @column()
  public price: number

  @column()
  public duration_days: number

  @column()
  public is_active: boolean

  @hasMany(() => PlanTouristActivity, {
    foreignKey: 'plan_id',
  })
  public planTouristActivities: HasMany<typeof PlanTouristActivity>

  @hasMany(() => PlanTravel, {
    foreignKey: 'plan_id',
  })
  public planTravels: HasMany<typeof PlanTravel>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
