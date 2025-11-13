import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class GuideUpdateValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    name: schema.string(),
    email: schema.string({}, [
      rules.email(),
      rules.unique({
        table: 'users',
        column: 'email',
        whereNot: { id: this.ctx.request.qs().user_id }
      }),
    ]),
    phone: schema.string(),
    identification_number: schema.string({}, [
      rules.unique({
        table: 'users',
        column: 'identification_number',
        whereNot: { id: this.ctx.request.qs().user_id }
      }),
    ]),
    document_type: schema.string(),
    birth_date: schema.date({ format: 'yyyy-MM-dd' }),
    active: schema.boolean(),
    hire_date: schema.date({ format: 'yyyy-MM-dd' }),
  })

  public messages: CustomMessages = {
    'email.unique': 'This email is already in use by another user',
    'identification_number.unique': 'This identification number is already in use by another user',
  }
}
