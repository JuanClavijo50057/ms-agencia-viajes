import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'quotas'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('amount').notNullable()
      table.integer('number_payments').notNullable()
      table.integer('travel_customer_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('travel_customers')
        .onDelete('CASCADE')
      table.enum('status', ['pending', 'paid']).notNullable().defaultTo('pending')
      table.date('due_date').notNullable()
     
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
    
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
