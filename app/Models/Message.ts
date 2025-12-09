import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import Conversation from './Conversation'

export default class Message extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public conversation_id: number
  @belongsTo(() => Conversation, { foreignKey: 'conversation_id' })
  public conversation: BelongsTo<typeof Conversation>
  @column()
  public sender_id: string

  @column()
  public receiver_id: string

  @column()
  public content: string

  @column()
  public read: boolean

  @column.dateTime({ autoCreate: true })
  public sent_at: DateTime
}
