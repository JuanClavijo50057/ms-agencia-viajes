import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CustomerUpdateValidator {
  constructor(protected ctx: HttpContextContract) {}

  public refs = schema.refs({
    customerId: this.ctx.params.id,
  })

  public schema = schema.create({
    email: schema.string.optional({}, [rules.email()]),
    name: schema.string.optional({}, [rules.minLength(3), rules.maxLength(255)]),
  })

  public messages: CustomMessages = {
    'name.minLength': 'Name must be at least 3 characters long',
    'name.maxLength': 'Name cannot exceed 255 characters',
  }
}
