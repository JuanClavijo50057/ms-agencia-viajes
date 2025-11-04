import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'bank_cards'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.enum('card_type', ['debit', 'credit']).notNullable()
      table.string('provider').notNullable()
      table.string('card_number', 16).notNullable().unique()
      table.string('card_holder', 100).notNullable()
      table.string('expiration_date', 5).notNullable()
      table.string('cvv', 4).notNullable()
      table.enum('status', ['active', 'inactive', 'blocked']).notNullable().defaultTo('active')
      table.boolean('is_default').notNullable().defaultTo(false)
      table.integer('customer_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('customers')
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
