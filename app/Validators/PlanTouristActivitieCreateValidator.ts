import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class PlanTouristActivitieCreateValidator {
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
    activities: schema.array().members(
      schema.number([
        rules.exists({ table: 'tourist_activities', column: 'id' }),
      ])
    
    ),
    name: schema.string(),
    description: schema.string(),
    duration_days: schema.number([
      rules.unsigned(),
      rules.range(1, 365),
    ]),
    is_active: schema.boolean(),
    price: schema.number.optional([
      rules.unsigned(),
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
    'activities.required': 'You must provide at least one activity',
    'activities.*.number': 'Each activity ID must be a number',
    'activities.*.exists': 'One or more activity IDs do not exist',
    'name.required': 'Name is required',
    'description.required': 'Description is required',
    'duration_days.required': 'Duration in days is required',
    'duration_days.unsigned': 'Duration must be a positive number',
    'duration_days.range': 'Duration must be between 1 and 365 days',
    'is_active.required': 'Active status is required',
  }
}
