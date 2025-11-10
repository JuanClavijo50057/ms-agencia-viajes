import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class TouristActivityValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    name: schema.string([
      rules.maxLength(255)
    ]),
    description: schema.string.optional([
      rules.maxLength(1000)
    ]),
    city_id: schema.number([
      rules.unsigned(),
      rules.exists({ table: 'cities', column: 'id' })
    ]),
    price: schema.number.optional([
      rules.unsigned()
    ]),
    is_active: schema.boolean()
  })

  public messages: CustomMessages = {
    'name.required': 'The activity name is required',
    'city_id.required': 'The city is required',
    'city_id.exists': 'The selected city does not exist',
    'price.unsigned': 'The price must be a positive number'
  }
}
