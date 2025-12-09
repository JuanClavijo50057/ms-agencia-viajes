import Conversation from 'App/Models/Conversation'
import ConversationParticipant from 'App/Models/ConversationParticipant'
import Message from 'App/Models/Message'
import CreateConversationValidator from 'App/Validators/CreateConversationValidator'
import SendMessageValidator from 'App/Validators/SendMessageValidator'

export default class MessagesController {
  public async createConversation({ request }) {
    const { type, participants } = await request.validate(CreateConversationValidator)

    // Crea la conversación
    const conversation = await Conversation.create({ type })

    
    await Promise.all(
      participants.map((p) =>
        ConversationParticipant.create({
          conversation_id: conversation.id,
          user_id: p.user_id,
          role: p.role,
        })
      )
    )

    return conversation
  }

  public async sendMessage({ request }) {
    const data = await request.validate(SendMessageValidator)
    const message = await Message.create(data)
    return message
  }

  public async getMessages({ params }) {
    return Message.query()
      .where('conversation_id', params.id)
      .orderBy('sent_at', 'asc')
  }
}
