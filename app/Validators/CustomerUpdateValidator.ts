import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CustomerUpdateValidator {
  constructor(protected ctx: HttpContextContract) {}

  public refs = schema.refs({
    customerId: this.ctx.params.id,
  })

  public schema = schema.create({
    user_id: schema.string({}, [
      rules.unique({
        table: 'customers',
        column: 'user_id',
        whereNot: { id: this.refs.customerId },
      }),
      rules.minLength(24),
      rules.maxLength(24),
    ]),
  })

  public messages: CustomMessages = {
    'user_id.required': 'User ID is required',
    'user_id.unique': 'This user is already registered as a customer',
    'user_id.minLength': 'User ID must be a valid MongoDB ObjectId (24 characters)',
    'user_id.maxLength': 'User ID must be a valid MongoDB ObjectId (24 characters)',
  }
}
