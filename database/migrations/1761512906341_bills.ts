import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'bills'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.float('amount').notNullable()
      table.date('due_date').notNullable()
      table.string('description', 255)
      table.integer('bank_card_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('bank_cards')
        .onDelete('CASCADE')
      table.integer('quota_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('quotas')
        .onDelete('CASCADE')
      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
