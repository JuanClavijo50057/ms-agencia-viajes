import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UserCustomerValidator {
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
    email: schema.string([
      rules.email(),
    ]),
    travel_id: schema.number([
      rules.exists({ table: 'travels', column: 'id' }),
    ]),
    password: schema.string({}, [
      rules.minLength(6),
    ]),
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
    'name.required': 'Name is required',
    'email.required': 'Email is required',
    'email.email': 'Email must be a valid email address',
    'email.unique': 'This email is already registered',
    'travel_id.required': 'Travel ID is required',
    'travel_id.exists': 'The specified travel does not exist',
    'password.required': 'Password is required',
    'password.minLength': 'Password must be at least 6 characters long',
  }
}
