import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class RoomTransportItineraryValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    room_id: schema.number([
      rules.exists({ table: 'rooms', column: 'id' }),
    ]),
    transport_itinerary_id: schema.number([
      rules.exists({ table: 'transport_itineraries', column: 'id' }),
    ]),
  })

  public messages: CustomMessages = {
    'room_id.required': 'The room ID is required',
    'room_id.exists': 'The selected room does not exist',
    'transport_itinerary_id.required': 'The transport itinerary ID is required',
    'transport_itinerary_id.exists': 'The selected transport itinerary does not exist',
  }
}
