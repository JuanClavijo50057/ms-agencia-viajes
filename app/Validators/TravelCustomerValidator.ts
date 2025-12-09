import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'

export default class TravelCustomerValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    travel_id: schema.number([
      rules.exists({ table: 'travels', column: 'id' }),
    ]),
    customer_id: schema.number([
      rules.exists({ table: 'customers', column: 'id' }),
      // 👇 Validación personalizada para evitar duplicado en travel_customers
      rules.uniqueCompound(
        'travel_customers',
        ['customer_id', 'travel_id'],
      ),
    ]),
  })

  public messages: CustomMessages = {
    'customer_id.uniqueCompound': 'Este cliente ya está asociado a este viaje.',
    'travel_id.exists': 'El viaje especificado no existe.',
    'customer_id.exists': 'El cliente especificado no existe.',
  }
}
