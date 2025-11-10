import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class PlanTouristActivityValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    plan_id: schema.number([
      rules.exists({ table: 'plans', column: 'id' }),
    ]),
    tourist_activity_id: schema.number([
      rules.exists({ table: 'tourist_activities', column: 'id' }),
    ]),
  })

  public messages: CustomMessages = {
    'plan_id.required': 'The plan ID is required',
    'plan_id.exists': 'The selected plan does not exist',
    'tourist_activity_id.required': 'The tourist activity ID is required',
    'tourist_activity_id.exists': 'The selected tourist activity does not exist',
  }
}
