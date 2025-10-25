import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class PlaneValidator {
  constructor(protected ctx: HttpContextContract) { }

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
    model: schema.number(
      [
        rules.unsigned(),
        rules.range(1900, new Date().getFullYear()),
      ]
    ),
    capacity: schema.number(
      [
        rules.unsigned(),
        rules.range(1, 500)
      ]
    ),
    airline_id: schema.number(
      [
        rules.unsigned(),
        rules.range(1, 100),
        rules.exists({ table: 'airlines', column: 'id' })
      ]
    ),
    color: schema.string(),
    brand: schema.string(
      [
        rules.minLength(2),
        rules.maxLength(50)
      ]
    ),
    
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
    'model.range': 'The model year must be between 1900 and the current year.',
    'capacity.range': 'The capacity must be between 1 and 500.',
    'airline_id.exists': 'The specified airline does not exist.',
  }
}
