import { schema, rules } from '@ioc:Adonis/Core/Validator'

export default class CreateConversationValidator {
  public schema = schema.create({
    type: schema.enum(['customer_admin', 'customer_guide']),
    participants: schema.array().members(
      schema.object().members({
        user_id: schema.string({}, [
          rules.trim(),
          rules.minLength(24),
          rules.maxLength(24),
          rules.externalUserExists(),
        ]),
        role: schema.enum(['customer', 'admin', 'guide']),
      })
    ),
  })
}
