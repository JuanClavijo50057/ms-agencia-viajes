import { DateTime } from 'luxon'
import { afterCreate, BaseModel, BelongsTo, belongsTo, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Customer from './Customer'
import Travel from './Travel'
import Quota from './Quota'
import Conversation from './Conversation'
import ConversationParticipant from './ConversationParticipant'
import Database from '@ioc:Adonis/Lucid/Database'

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
    console.log("creando");

    // 1️⃣ Buscar todos los administradores de hotel asociados a este viaje
    const admins = await Database
      .from('transport_itineraries as ti')
      .join('room_transport_itineraries as rti', 'rti.transport_itinerary_id', 'ti.id')
      .join('rooms as r', 'r.id', 'rti.room_id')
      .join('hotels as h', 'h.id', 'r.hotel_id')
      .join('administrators as a', 'a.id', 'h.administrator_id')
      .where('ti.travel_id', travelId)
      .distinct('a.user_id as user_id')
    console.log(admins);

    // Si no hay administradores, salimos
    if (admins.length === 0) return
    const customer = await Database
      .from('customers')
      .where('id', customerId)
      .select('user_id')
      .first()
    if (!customer) return

    // 2️⃣ Por cada admin, crear conversación
    for (const admin of admins) {
      const conversation = await Conversation.create({
        type: 'customer_admin',
      })

      // 3️⃣ Añadir los participantes
      await ConversationParticipant.createMany([
        {
          conversation_id: conversation.id,
          user_id: customer.user_id, // el customer
          role: 'customer',
        },
        {
          conversation_id: conversation.id,
          user_id: admin.user_id, // el admin
          role: 'admin',
        },
      ])
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
        .where('cp1.user_id', customerId)
        .andWhere('cp2.user_id', other.customer_id)
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
}
