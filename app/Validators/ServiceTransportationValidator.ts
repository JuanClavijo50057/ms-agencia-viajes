import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ServiceTransportationValidator {
  constructor(protected ctx: HttpContextContract) {}

  /*
   * Define schema to validate the "shape", "type", "formatting" and "integrity" of data.
   *
   * For example:
   * 1. The username must be of data type string. But then also, it should
   *    not contain special characters or numbers.
   *    ```
   *     schema.string([ rules.alpha() ])
   *    ```
   *
   * 2. The email must be of data type string, formatted as a valid
   *    email. But also, not used by any other user.
   *    ```
   *     schema.string([
   *       rules.email(),
   *       rules.unique({ table: 'users', column: 'email' }),
   *     ])
   *    ```
   */
  public schema = schema.create({
    start_date: schema.date({
      format: 'yyyy-MM-dd'
    }),
    end_date: schema.date({
      format: 'yyyy-MM-dd'
    }, [
      rules.afterField('start_date')
    ]),
    cost: schema.number([
      rules.unsigned(),
      rules.range(0.01, 999999.99)
    ]),
    transportation_id: schema.number([
      rules.unsigned(),
      rules.exists({ table: 'vehicles', column: 'id' })
    ]),
    journey_id: schema.number([
      rules.unsigned(),
      rules.exists({ table: 'journeys', column: 'id' })
    ])
  })

  /**
   * Custom messages for validation failures. You can make use of dot notation `(.)`
   * for targeting nested fields and array expressions `(*)` for targeting all
   * children of an array. For example:
   *
   * {
   *   'profile.username.required': 'Username is required',
   *   'scores.*.number': 'Define scores as valid numbers'
   * }
   *
   */
  public messages: CustomMessages = {
    'startDate.required': 'La fecha de inicio es requerida',
    'startDate.date': 'La fecha de inicio debe ser una fecha válida',
    'endDate.required': 'La fecha de fin es requerida',
    'endDate.date': 'La fecha de fin debe ser una fecha válida',
    'endDate.afterField': 'La fecha de fin debe ser posterior a la fecha de inicio',
    'cost.required': 'El costo es requerido',
    'cost.number': 'El costo debe ser un número válido',
    'cost.unsigned': 'El costo debe ser un número positivo',
    'cost.range': 'El costo debe estar entre 0.01 y 999999.99',
    'transportation_id.required': 'El ID del transporte es requerido',
    'transportation_id.number': 'El ID del transporte debe ser un número',
    'transportation_id.unsigned': 'El ID del transporte debe ser positivo',
    'transportation_id.exists': 'El vehículo seleccionado no existe',
    'journey_id.required': 'El ID del viaje es requerido',
    'journey_id.number': 'El ID del viaje debe ser un número',
    'journey_id.unsigned': 'El ID del viaje debe ser positivo',
    'journey_id.exists': 'El viaje seleccionado no existe'
  }
}