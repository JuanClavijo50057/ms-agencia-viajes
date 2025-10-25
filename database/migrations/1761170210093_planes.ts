import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'planes'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table
        .integer('id')
        .unsigned()
        .primary()
        .references('id')
        .inTable('vehicles')
        .onDelete('CASCADE')

      table.integer('airline_id').unsigned().references('id').inTable('airlines').onDelete('CASCADE')
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
