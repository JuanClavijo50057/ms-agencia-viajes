import { DateTime } from 'luxon'
import { BaseModel, belongsTo, BelongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Guide from './Guide'
import TouristActivity from './TouristActivity'

export default class GuideActivity extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public guide_id: number

  @column()
  public activity_id: number

  @column.dateTime()
  public date: DateTime;

  @belongsTo(() => Guide, {
    foreignKey: "guide_id", // Foreign key on the guide model
  })
  public guide: BelongsTo<typeof Guide>;

  @belongsTo(() => TouristActivity, {
    foreignKey: "activity_id", // Foreign key on the activity model
  })
  public activity: BelongsTo<typeof TouristActivity>;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
