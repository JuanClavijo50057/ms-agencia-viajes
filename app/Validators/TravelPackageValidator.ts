import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'


export default class TravelPackageValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    // 👇 aplicamos ambas reglas al array
    items: schema
      .array([
        rules.sequentialDates(),  
        rules.sequentialCities(), 
      ])
      .members(
        schema.object().members({
          hotel_id: schema.number([
            rules.exists({ table: 'hotels', column: 'id' }),
          ]),

          plan_ids: schema.array().members(
            schema.number([
              rules.exists({ table: 'plans', column: 'id' }),
            ])
          ),

          room_ids: schema.array().members(
            schema.number([
              rules.exists({ table: 'rooms', column: 'id' }),
            ])
          ),

          cityFrom: schema.number([
            rules.exists({ table: 'cities', column: 'id' }),
          ]),

          cityTo: schema.number([
            rules.exists({ table: 'cities', column: 'id' }),
          ]),

          vehicle: schema.number([
            rules.exists({ table: 'vehicles', column: 'id' }),
          ]),

          order: schema.number(),

          date_from: schema.date.optional({ format: 'yyyy-MM-dd' }),
          date_to: schema.date.optional({ format: 'yyyy-MM-dd' }),
        })
      ),
  })

  public messages = {
    'items.required': 'La lista de items es obligatoria',
    'items.array': 'items debe ser un arreglo',

    'items.*.hotel_id.required': 'Cada item debe tener hotel_id',
    'items.*.hotel_id.exists': 'El hotel_id no existe',

    'items.*.plan_ids.array': 'plan_ids debe ser un arreglo de ids',
    'items.*.plan_ids.*.exists': 'Algún plan_id no existe',

    'items.*.room_ids.array': 'room_ids debe ser un arreglo de ids',
    'items.*.room_ids.*.exists': 'Algún room_id no existe',

    'items.*.date_from.format': 'date_from debe tener formato yyyy-MM-dd',
    'items.*.date_to.format': 'date_to debe tener formato yyyy-MM-dd',

    'items.*.cityFrom.required': 'Cada item debe tener cityFrom',
    'items.*.cityFrom.exists': 'El cityFrom no existe',

    'items.*.cityTo.required': 'Cada item debe tener cityTo',
    'items.*.cityTo.exists': 'El cityTo no existe',

    'items.*.vehicle.required': 'Cada item debe tener vehicle',
    'items.*.vehicle.exists': 'El vehicle no existe',

    'items.*.order.required': 'Cada item debe tener order',

    // 👇 mensajes personalizados para tus reglas
    'sequentialDates': 'Las fechas de los trayectos deben ser consecutivas.',
    'sequentialCities': 'Las ciudades de los trayectos deben estar encadenadas correctamente.',
  }
}
