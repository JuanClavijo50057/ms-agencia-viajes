import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class PlanValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    name: schema.string([
      rules.maxLength(255)
    ]),
    description: schema.string.optional([
      rules.maxLength(1000)
    ]),
    price: schema.number.optional([
      rules.unsigned()
    ]),
    duration_days: schema.number([
      rules.unsigned(),
      rules.range(1, 365)
    ]),
    is_active: schema.boolean()
  })

  public messages: CustomMessages = {
    'name.required': 'The plan name is required',
    'price.unsigned': 'The price must be a positive number',
    'duration_days.required': 'The duration in days is required',
    'duration_days.range': 'Duration must be between 1 and 365 days'
  }
}
