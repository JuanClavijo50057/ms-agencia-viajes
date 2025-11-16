import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class GuideUpdateValidator {
  constructor(protected ctx: HttpContextContract) {}

  public refs = schema.refs({
    guideId: this.ctx.params.id,
  })

  public schema = schema.create({
    user_id: schema.string({}, [
      rules.unique({
        table: 'guides',
        column: 'user_id',
        whereNot: { id: this.refs.guideId },
      }),
      rules.minLength(24),
      rules.maxLength(24),
    ]),
    active: schema.boolean(),
    hire_date: schema.date({ format: 'yyyy-MM-dd' }),
  })

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
