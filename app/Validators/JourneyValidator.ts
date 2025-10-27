import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class JourneyValidator {
  constructor(protected ctx: HttpContextContract) { }
  public refs = schema.refs({
    origin_id: this.ctx.request.input('origin_id'),
  })
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
    origin_id: schema.number([
      rules.exists({ table: 'cities', column: 'id' }),
    ]),
    destination_id: schema.number([
      rules.exists({ table: 'cities', column: 'id' }),
      rules.notIn([this.refs.origin_id as any]), // 👈 evita que sean iguales
    ]),
  })
  public cacheKey = this.ctx.routeKey

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
    'origin_id.exists': 'The specified origin city does not exist.',
    'destination_id.exists': 'The specified destination city does not exist.',
    'destination_id.notIn': 'The destination city must be different from the origin city.',
  }
}
