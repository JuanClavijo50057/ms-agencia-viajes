import { BaseModel, column, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import ConversationParticipant from './ConversationParticipant'
import Message from './Message'

export default class Conversation extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public type: 'customer_admin' | 'customer_guide' | 'customer_customer'

  @hasMany(() => ConversationParticipant,{ foreignKey: 'conversation_id' })
  public participants: HasMany<typeof ConversationParticipant>

  @hasMany(() => Message, { foreignKey: 'conversation_id' })
  public messages: HasMany<typeof Message>
}
