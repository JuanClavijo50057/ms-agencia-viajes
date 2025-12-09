import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Conversation from 'App/Models/Conversation'
import SecurityService from 'App/Services/SecurityService'

export default class ConversationsController {
  /**
   * GET /conversations/:user_id
   * Devuelve todas las conversaciones del usuario (con participantes y mensajes)
   * e incluye información del perfil desde ms-seguridad.
   */
  public async getUserConversations({ params, response }: HttpContextContract) {
    const { user_id } = params

    try {
      // 1️⃣ Buscar todas las conversaciones donde participa este user_id
      const conversations = await Conversation.query()
        .whereHas('participants', (participantQuery) => {
          participantQuery.where('user_id', user_id)
        })
        .preload('participants', (participantQuery) => {
          participantQuery.select(['user_id', 'role'])
        })
        .preload('messages', (messageQuery) => {
          messageQuery.orderBy('sent_at', 'asc')
        })
        .orderBy('updated_at', 'desc')

      // 2️⃣ Traer información del usuario desde ms-seguridad
      //    Haremos un mapeo de todos los participantes únicos
      const allUserIds = [
        ...new Set(conversations.flatMap((conv) => conv.participants.map((p) => p.user_id))),
      ]

      // 3️⃣ Llamadas paralelas al SecurityService
      const usersInfo = await Promise.all(
        allUserIds.map(async (uid) => {
          try {
            const userData = await SecurityService.getUserById(uid)
            return { id: uid, name: userData.name, email: userData.email }
          } catch {
            return { id: uid, name: 'Unknown', email: 'N/A' }
          }
        })
      )

      // 4️⃣ Convertimos a un diccionario { userId -> info }
      const usersMap = Object.fromEntries(usersInfo.map((u) => [u.id, u]))

      // 5️⃣ Enriquecer las conversaciones con los datos de usuario
      const result = conversations.map((conversation) => ({
        id: conversation.id,
        type: conversation.type,
        participants: conversation.participants.map((p) => ({
          user_id: p.id,
          role: p.role,
          user_info: usersMap[p.user_id] || { name: 'Unknown', email: 'N/A' },
        })),
        messages: conversation.messages,
      }))

      // 6️⃣ Respuesta final
      return response.ok({
        status: 'success',
        count: result.length,
        data: result,
      })
    } catch (error) {
      console.error('Error fetching conversations:', error)
      return response.status(500).send({
        status: 'error',
        message: 'Error retrieving conversations',
        error: error.message,
      })
    }
  }
}
