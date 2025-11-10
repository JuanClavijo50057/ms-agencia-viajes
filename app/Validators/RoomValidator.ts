import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class RoomValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    room_number: schema.string([
      rules.maxLength(50)
    ]),
    price_per_night: schema.number([
      rules.unsigned()
    ]),
    is_available: schema.boolean(),
    hotel_id: schema.number([
      rules.unsigned(),
      rules.exists({ table: 'hotels', column: 'id' })
    ])
  })

  public messages: CustomMessages = {
    'room_number.required': 'The room number is required',
    'price_per_night.required': 'The price per night is required',
    'price_per_night.unsigned': 'The price must be a positive number',
    'hotel_id.exists': 'The selected hotel does not exist'
  }
}
