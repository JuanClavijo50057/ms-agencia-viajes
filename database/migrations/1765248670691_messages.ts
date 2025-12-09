import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class ChatMessages extends BaseSchema {
  protected tableName = 'messages'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      // 🔑 Clave primaria
      table.increments('id')

      // 🔗 Relación con conversations
      table
        .integer('conversation_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('conversations')
        .onDelete('CASCADE')

      // 👤 Usuarios (referencian user_id del ms-seguridad)
      table.string('sender_id', 24).notNullable()
      table.string('receiver_id', 24).notNullable()

      // 💬 Contenido del mensaje
      table.text('content').notNullable()

      // 🕒 Momento en que se envía
      table.timestamp('sent_at', { useTz: true }).defaultTo(this.now())

      // 📖 Estado de lectura
      table.boolean('read').defaultTo(false)

      // 🗓️ Control de creación y actualización
      table.timestamps(true, true)
    })
  }

  public async down() {
    this.schema.dropTableIfExists(this.tableName)
  }
}
