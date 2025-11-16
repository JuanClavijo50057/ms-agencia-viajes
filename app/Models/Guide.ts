import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import GuideActivity from './GuideActivity'

export default class Guide extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public user_id: string

  @column()
  public active: boolean

  @column.dateTime()
  public hire_date: DateTime

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => GuideActivity, {
      foreignKey: 'guide_id',
    })
    public guideActivities: HasMany<typeof GuideActivity>
}
