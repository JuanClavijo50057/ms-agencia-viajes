import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AdministratorValidator {
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
    user_id: schema.number(
      [
        rules.unsigned(),
        rules.exists({ table: 'users', column: 'id' }),
        rules.unique({ table: 'administrators', column: 'user_id' }),
      ]
    ),
    active: schema.enum(
      ['Y', 'N'] as const
    ),
    hire_date: schema.date(
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
    'user_id.required': 'The user_id field is required.',
    'user_id.exists': 'The specified user_id does not exist.',
    'user_id.unique': 'The specified user_id is already associated with another administrator.',
    'hire_date.required': 'The hire_date field is required.',
    'hire_date.date': 'The hire_date must be a valid date in the format YYYY-MM-DD.',
  }
}
