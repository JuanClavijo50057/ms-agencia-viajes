import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class BankCardValidator {
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
    card_type: schema.enum(['debit', 'credit'] as const),
    provider: schema.string(
      [
        rules.trim(),
        rules.maxLength(100)
      ]
    ),
    card_number: schema.string(
      [
        rules.trim(),
        rules.unique({ table: 'bank_cards', column: 'card_number' }),
      ]
    ),
    card_holder: schema.string(
      [
        rules.trim(),
        rules.maxLength(100)
      ]
    ),
    expiration_date: schema.string([
      rules.regex(/^(0[1-9]|1[0-2])\/\d{2}$/) // formato MM/YY
    ]),
    cvv: schema.string(
      [
        rules.trim(),
        rules.maxLength(4),
        rules.minLength(3)
      ]
    ),
    status: schema.enum(['active', 'inactive', 'blocked'] as const),
    is_default: schema.boolean(),
    customer_id: schema.number(
      [
        rules.unsigned(),
        rules.exists({ table: 'customers', column: 'id' })
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
    'card_type.enum': 'The card type must be either debit or credit.'
  }
}
