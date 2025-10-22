import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'vehicles'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('brand').notNullable()
      table.enum('tipo', ['carro', 'aeronave']).notNullable()
      table.integer('model').notNullable()
      table.string('color').notNullable()
      table.string('license_plate').notNullable().unique()
      table.integer('capacity').notNullable()
      table.integer('gps_id').unsigned().references('id').inTable('gps')
      
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
