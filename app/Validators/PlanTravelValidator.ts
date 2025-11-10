import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class PlanTravelValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    plan_id: schema.number([
      rules.exists({ table: 'plans', column: 'id' }),
    ]),
    travel_id: schema.number([
      rules.exists({ table: 'travels', column: 'id' }),
    ]),
  })

  public messages: CustomMessages = {
    'plan_id.required': 'The plan ID is required',
    'plan_id.exists': 'The selected plan does not exist',
    'travel_id.required': 'The travel ID is required',
    'travel_id.exists': 'The selected travel does not exist',
  }
}
