import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class HotelValidator {
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
    name: schema.string(),
    address: schema.string(),
    stars: schema.number([
      rules.range(0, 5)
    ]),
    amenities: schema.string(),
    city_id: schema.number([
      rules.exists({ table: 'cities', column: 'id' })
    ]),
    administrator_id: schema.number([
      rules.exists({ table: 'administrators', column: 'id' })
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
    'city_id.exists': 'The specified city does not exist.',
    'administrator_id.exists': 'The specified administrator does not exist.',
    'name.required': 'Name is required.',
    'address.required': 'Address is required.',
    'stars.required': 'Stars rating is required.',
    'amenities.required': 'Amenities are required.',
    'city_id.required': 'City ID is required.',
    'administrator_id.required': 'Administrator ID is required.',
    
  }
}
