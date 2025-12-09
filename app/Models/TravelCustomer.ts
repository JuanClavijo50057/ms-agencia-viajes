import { DateTime } from 'luxon'
import { afterCreate, afterUpdate, BaseModel, BelongsTo, belongsTo, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Customer from './Customer'
import Travel from './Travel'
import Quota from './Quota'
import Conversation from './Conversation'
import ConversationParticipant from './ConversationParticipant'
import Database from '@ioc:Adonis/Lucid/Database'
import { NotificationService } from 'App/Services/NotificationService'
import SecurityService from 'App/Services/SecurityService'

export default class TravelCustomer extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public travel_id: number

  @column()
  public customer_id: number
  @column()
  public status: 'draft' | 'inPayment' | 'paid'

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => Quota, {
    foreignKey: 'travel_customer_id'
  })
  public quotas: HasMany<typeof Quota>

  @belongsTo(() => Customer, {
    foreignKey: 'customer_id'
  })
  public customer: BelongsTo<typeof Customer>

  @belongsTo(() => Travel, {
    foreignKey: 'travel_id'
  })
  public travel: BelongsTo<typeof Travel>
  @afterCreate()
  public static async createConversationsForHotels(travelCustomer: TravelCustomer) {
    const travelId = travelCustomer.travel_id
    const customerId = travelCustomer.customer_id

    const admins = await Database
      .from('transport_itineraries as ti')
      .join('room_transport_itineraries as rti', 'rti.transport_itinerary_id', 'ti.id')
      .join('rooms as r', 'r.id', 'rti.room_id')
      .join('hotels as h', 'h.id', 'r.hotel_id')
      .join('administrators as a', 'a.id', 'h.administrator_id')
      .where('ti.travel_id', travelId)
      .distinct('a.user_id as user_id')

    if (admins.length === 0) return

    const customer = await Database
      .from('customers')
      .where('id', customerId)
      .select('user_id')
      .first()
    if (!customer) return

    for (const admin of admins) {
      const existingConversation = await Database
        .from('conversations as c')
        .join('conversation_participants as cp1', 'cp1.conversation_id', 'c.id')
        .join('conversation_participants as cp2', 'cp2.conversation_id', 'c.id')
        .where('c.type', 'customer_admin')
        .andWhere('cp1.user_id', customer.user_id)
        .andWhere('cp2.user_id', admin.user_id)
        .first()

      if (!existingConversation) {
        const conversation = await Conversation.create({
          type: 'customer_admin',
        })

        await ConversationParticipant.createMany([
          {
            conversation_id: conversation.id,
            user_id: customer.user_id,
            role: 'customer',
          },
          {
            conversation_id: conversation.id,
            user_id: admin.user_id,
            role: 'admin',
          },
        ])
      }
    }

    const otherCustomers = await Database
      .from('travel_customers as tc')
      .join('customers as c', 'c.id', 'tc.customer_id')
      .where('tc.travel_id', travelId)
      .andWhereNot('tc.customer_id', customerId)
      .select('c.user_id as user_id', 'tc.customer_id as customer_id')

    for (const other of otherCustomers) {
      const existingConversation = await Database
        .from('conversations as c')
        .join('conversation_participants as cp1', 'cp1.conversation_id', 'c.id')
        .join('conversation_participants as cp2', 'cp2.conversation_id', 'c.id')
        .where('c.type', 'customer_customer')
        .andWhere('cp1.user_id', customer.user_id)
        .andWhere('cp2.user_id', other.user_id)
        .first()

      if (!existingConversation) {
        const conversation = await Conversation.create({ type: 'customer_customer' })

        await ConversationParticipant.createMany([
          {
            conversation_id: conversation.id,
            user_id: customer.user_id,
            role: 'customer',
          },
          {
            conversation_id: conversation.id,
            user_id: other.user_id,
            role: 'customer',
          },
        ])
      }
    }
  }
  @afterUpdate()
  public static async notifyStatusChange(travelCustomer: TravelCustomer) {
    try {
      // Solo notificar si el status cambió

      const { customer_id, travel_id, status } = travelCustomer
      if (status == "inPayment") return

      // Obtener el user_id del customer
      const customer = await Database.from('customers')
        .where('id', customer_id)
        .select('user_id')
        .first()

      if (!customer?.user_id) return

      // Traer el perfil desde ms-seguridad
      const profile = await SecurityService.getUserById(customer.user_id)
      if (!profile?.email) return

      // Obtener nombre del viaje
      const travel = await Database.from('travels')
        .where('id', travel_id)
        .select('name')
        .first()

      const subject = `Actualización de tu viaje "${travel?.name || 'sin nombre'}"`
      const message = `
Hola ${profile.name || 'viajero'}, 


${status === 'paid'
          ? '🎉 ¡Felicitaciones! El pago de tu viaje está completado.'
          : '🕓 Tu reserva ha sido creada y está pendiente de pago.'
        }

Puedes revisar el estado actual en tu cuenta dentro de la plataforma.

— Equipo Agencia de Viajes
`

      await NotificationService.sendNotification(profile.email, subject, message)
      console.log(`📧 Notificación enviada a ${profile.email} por cambio de estado a ${status}`)
    } catch (error) {
      console.error('❌ Error enviando notificación de estado de TravelCustomer:', error.message)
    }
  }
}
