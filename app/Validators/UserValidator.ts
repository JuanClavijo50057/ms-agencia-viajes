import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UserValidator {
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
    name: schema.string(
      [
        rules.trim(),
        rules.minLength(8),
        rules.maxLength(255)
      ]
    ),
    email: schema.string(
      [
        rules.email(),
        rules.unique({ table: 'users', column: 'email' }),
        rules.maxLength(255),
      ]
    ),
    phone: schema.string(
      [
        rules.trim(),
        rules.minLength(6),
        rules.maxLength(20)
      ]
    ),
    identification_number: schema.string(
      [
        rules.trim(),
        rules.minLength(4),
        rules.maxLength(50),
        rules.unique({ table: 'users', column: 'identification_number' }),
      ]
    ),
    document_type: schema.enum(
      ['CC', 'TI', 'CE', 'PAS'] as const
    ),
    birth_date: schema.date(
      { format: 'yyyy-MM-dd' }
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
    'email.email': 'The email format is invalid.',
    'email.unique': 'The email has already been taken.',
    'identification_number.unique': 'The identification number has already been taken.',
    
  }
}
