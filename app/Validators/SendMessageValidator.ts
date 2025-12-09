import { schema, rules } from '@ioc:Adonis/Core/Validator'

export default class SendMessageValidator {
  public schema = schema.create({
    conversation_id: schema.number([
      rules.exists({ table: 'conversations', column: 'id' }),
    ]),
    sender_id: schema.string({}, [
      rules.trim(),
      rules.minLength(24),
      rules.maxLength(24),
      rules.externalUserExists(),
    ]),
    receiver_id: schema.string({}, [
      rules.trim(),
      rules.minLength(24),
      rules.maxLength(24),
      rules.externalUserExists(),
    ]),
    content: schema.string({}, [rules.minLength(1)]),
  })
}
