import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'guides_activities'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('guide_id').unsigned().references('id').inTable('guides').notNullable().onDelete('CASCADE')
      table.integer('activity_id').unsigned().references('id').inTable('tourist_activities').notNullable().onDelete('CASCADE')
      table.timestamp('date', { useTz: true }).notNullable()

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
