import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Conversation from './Conversation'

export default class ConversationParticipant extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public conversation_id: number
  @belongsTo(() => Conversation, { foreignKey: 'conversation_id' })
  public conversation: BelongsTo<typeof Conversation>
  @column()
  public user_id: string

  @column()
  public role: 'customer' | 'admin' | 'guide'
}
