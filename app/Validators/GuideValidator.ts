import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class GuideValidator {
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
    user_id: schema.string({}, [
      rules.unique({ table: 'guides', column: 'user_id' }),
      rules.minLength(24),
      rules.maxLength(24),
    ]),
    active: schema.boolean(),
    hire_date: schema.date({ format: 'yyyy-MM-dd' }),
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
    'user_id.required': 'User ID is required',
    'user_id.unique': 'This user is already registered as a guide',
    'user_id.minLength': 'User ID must be a valid MongoDB ObjectId (24 characters)',
    'user_id.maxLength': 'User ID must be a valid MongoDB ObjectId (24 characters)',
    'active.required': 'Active status is required',
    'active.boolean': 'Active must be a boolean value',
    'hire_date.required': 'The hire_date field is required.',
    'hire_date.date': 'The hire_date must be a valid date in the format YYYY-MM-DD.',
  }
}
