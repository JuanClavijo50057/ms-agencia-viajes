import { DateTime } from 'luxon'
import { afterCreate, afterUpdate, BaseModel, BelongsTo, belongsTo, column, HasOne, hasOne } from '@ioc:Adonis/Lucid/Orm'
import Travel from './Travel'
import Bill from './Bill'
import TravelCustomer from './TravelCustomer'
import Database from '@ioc:Adonis/Lucid/Database'

export default class Quota extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public amount: number

  @column()
  public number_payments: number

  @column()
  public travel_customer_id: number

  @column()
  public status: 'pending' | 'paid'
  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
  @column.date()
  public due_date: DateTime

  @belongsTo(() => TravelCustomer, {
    foreignKey: 'travel_customer_id'
  })
  public travelCustomer: BelongsTo<typeof TravelCustomer>

  @hasOne(() => Bill, {
    foreignKey: 'quota_id',
  })
  public bill: HasOne<typeof Bill>
  @afterCreate()
  @afterUpdate()
  public static async updateTravelCustomerStatus(quota: Quota) {
    const travelCustomerId = quota.travel_customer_id
    if (!travelCustomerId) return

    // 1️⃣ Consultar todas las cuotas de ese travel_customer
    const quotas = await Database.from('quotas')
      .where('travel_customer_id', travelCustomerId)
      .select('status')

    const allPaid = quotas.every((q) => q.status === 'paid')

    const newStatus = allPaid ? 'paid' : 'inPayment'

    await Database.from('travel_customers')
      .where('id', travelCustomerId)
      .update({ status: newStatus, updated_at: new Date() })
  }
}
