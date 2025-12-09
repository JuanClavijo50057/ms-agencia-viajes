import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class ConversationParticipants extends BaseSchema {
  protected tableName = 'conversation_participants'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      // 🔗 Relación con conversations
      table
        .integer('conversation_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('conversations')
        .onDelete('CASCADE')

      // 👤 Usuario (puede ser customer, admin o guide)
      table.string('user_id', 24).notNullable()

      // 🧩 Rol del usuario en la conversación
      table
        .enum('role', ['customer', 'admin', 'guide'], {
          useNative: true,
          enumName: 'participant_role',
          existingType: false,
        })
        .notNullable()

      // 🗓️ Fechas automáticas
      table.timestamps(true, true)
    })
  }

  public async down() {
    // Borramos el enum personalizado antes de eliminar la tabla (PostgreSQL)
    this.schema.raw('DROP TYPE IF EXISTS participant_role CASCADE')
    this.schema.dropTable(this.tableName)
  }
}
