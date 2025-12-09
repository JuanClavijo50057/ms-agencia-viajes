import { afterCreate, BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import Conversation from './Conversation'
import { NotificationService } from 'App/Services/NotificationService'
import SecurityService from 'App/Services/SecurityService'
import Ws from 'App/Services/Ws'

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

  /**
   * Hook que envía correo y notificación en tiempo real
   */
  @afterCreate()
  public static async sendEmailNotification(message: Message) {
    try {
      // 1️⃣ Obtener info del receptor
      const receiverInfo = await SecurityService.getUserById(message.receiver_id)

      if (!receiverInfo || !receiverInfo.email) {
        console.warn('⚠️ Receptor sin correo registrado, no se envía notificación.')
        return
      }

      // 2️⃣ Construir correo
      const subject = 'Tienes un nuevo mensaje en la plataforma de viajes ✉️'
      const body = `
        ¡Hola ${receiverInfo.name || 'usuario'}!
        Has recibido un nuevo mensaje: 
        "${message.content}"
        Ingresa a la aplicación para responderlo.
        
        — Equipo Agencia de Viajes
      `

      // 3️⃣ Enviar correo por microservicio
      await NotificationService.sendNotification(receiverInfo.email, subject, body)

      console.log(`✅ Correo enviado a ${receiverInfo.email}`)

      // 4️⃣ Emitir notificación en tiempo real (WebSocket)
      Ws.io.to(`user:${message.receiver_id}`).emit('new_notification', {
        type: 'new_message',
        conversationId: message.conversation_id,
        senderId: message.sender_id,
        receiverId: message.receiver_id,
        content: message.content,
        sentAt: message.sent_at,
      })

      console.log(`📡 Notificación enviada vía WS a user:${message.receiver_id}`)
    } catch (error) {
      console.error('❌ Error enviando notificación de mensaje:', error.message)
    }
  }
}
