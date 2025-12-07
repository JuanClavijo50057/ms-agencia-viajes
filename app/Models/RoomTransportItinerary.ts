import { DateTime } from 'luxon'
import { afterCreate, afterDelete, afterUpdate, BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Room from './Room'
import TransportItinerary from './TransportItinerary'
import Database from '@ioc:Adonis/Lucid/Database'

export default class RoomTransportItinerary extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public room_id: number

  @column()
  public transport_itinerary_id: number

  @belongsTo(() => Room, {
    foreignKey: 'room_id',
  })
  public room: BelongsTo<typeof Room>

  @belongsTo(() => TransportItinerary, {
    foreignKey: 'transport_itinerary_id',
  })
  public transportItinerary: BelongsTo<typeof TransportItinerary>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @afterCreate()
  @afterDelete()
  @afterUpdate()
  public static async updateTravelPrice(
    transportItinerary: { travel_id: number },
    trx?: any
  ) {
    const travelId = transportItinerary.travel_id
    if (!travelId) return

    // Si hay transacción, la usamos directamente; si no, usamos Database
    const query = trx || Database

    // 🔹 1️⃣ Sumar costos de transporte
    const transportResult = await query
      .from('transport_itineraries as ti')
      .join('service_transportations as st', 'st.id', 'ti.service_transportation_id')
      .where('ti.travel_id', travelId)
      .sum('st.cost as total_transport')
      .first()

    const totalTransport = Number(transportResult?.total_transport || 0)

    // 🔹 2️⃣ Sumar precios de habitaciones
    const roomResult = await query
      .from('room_transport_itineraries as rti')
      .join('rooms as r', 'r.id', 'rti.room_id')
      .join('transport_itineraries as ti', 'ti.id', 'rti.transport_itinerary_id')
      .where('ti.travel_id', travelId)
      .sum('r.price_per_night as total_rooms')
      .first()
    const plansSumResult = await query
      .from('plan_travels as pt')
      .join('plans as p', 'p.id', 'pt.plan_id')
      .where('pt.travel_id', travelId)
      .sum('p.price as total_plans')
      .first()
    const totalRooms = Number(roomResult?.total_rooms || 0)

    // 🔹 3️⃣ Calcular total combinado
    const totalPlans = Number(plansSumResult?.total_plans || 0)
    const total = totalTransport + totalRooms + totalPlans

    // 🔹 4️⃣ Actualizar el precio total del viaje
    await query.from('travels').where('id', travelId).update({ price: total })
  }
}
