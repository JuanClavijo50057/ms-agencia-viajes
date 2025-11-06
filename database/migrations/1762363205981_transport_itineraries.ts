import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'transport_itineraries'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('sequence').notNullable()
      table.integer('travel_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('travels')
        .onDelete('CASCADE')
      table.integer('journey_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('journeys')
        .onDelete('CASCADE')
      table.integer('service_transportation_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('service_transportations')
        .onDelete('CASCADE')
      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
