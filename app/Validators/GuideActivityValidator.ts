import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class GuideActivityValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    guide_id: schema.number([
      rules.exists({ table: 'guides', column: 'id' }),
    ]),
    activity_id: schema.number([
      rules.exists({ table: 'tourist_activities', column: 'id' }),
    ]),
    date: schema.date.optional({ format: 'yyyy-MM-dd HH:mm:ss' }),
  })

  public messages: CustomMessages = {
    'guide_id.required': 'The guide ID is required',
    'guide_id.exists': 'The selected guide does not exist',
    'activity_id.required': 'The activity ID is required',
    'activity_id.exists': 'The selected tourist activity does not exist',
    'date.date': 'The date must be a valid date',
  }
}
