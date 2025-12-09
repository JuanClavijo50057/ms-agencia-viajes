import { DateTime } from 'luxon'
import { afterCreate, afterUpdate, BaseModel, BelongsTo, belongsTo, column, HasOne, hasOne } from '@ioc:Adonis/Lucid/Orm'
import Travel from './Travel'
import Bill from './Bill'
import TravelCustomer from './TravelCustomer'
import Database from '@ioc:Adonis/Lucid/Database'
import { NotificationService } from 'App/Services/NotificationService'
import SecurityService from 'App/Services/SecurityService'

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

    const quotas = await Database.from('quotas')
      .where('travel_customer_id', travelCustomerId)
      .select('status')

    const allPaid = quotas.every((q) => q.status === 'paid')

    const newStatus = allPaid ? 'paid' : 'inPayment'

    const travelCustomer = await TravelCustomer.find(travelCustomerId)
    if (travelCustomer) {
      travelCustomer.status = newStatus
      await travelCustomer.save() 
    }
  }
  @afterUpdate()
  public static async notifyOnUpdate(quota: Quota) {
    await Quota.sendQuotaNotification(quota)
  }

  private static async sendQuotaNotification(
    quota: Quota,
  ) {
    try {
      // Buscar el user_id del cliente
      const row = await Database.from('travel_customers as tc')
        .join('customers as c', 'c.id', 'tc.customer_id')
        .where('tc.id', quota.travel_customer_id)
        .select('c.user_id')
        .first()

      if (!row?.user_id) return

      // Obtener email y nombre desde ms-seguridad
      const profile = await SecurityService.getUserById(row.user_id)
      if (!profile?.email) return

      // Construir el correo
      const subject =
        quota.status === 'paid'
          ? 'Pago recibido — Detalle de tu cuota'
          : 'Actualización de tu cuota'
      const body = `
Hola ${profile.name || 'viajero'},

Tu cuota #${quota.id} ha cambiado de estado a "${quota.status}".
        

${quota.status === 'paid' ? '¡Gracias por tu pago! ✨' : 'Recuerda la fecha límite: ' + (quota.due_date?.toISODate?.() || '')}

Puedes revisar los detalles en tu cuenta.

— Agencia de Viajes
`

      // Enviar correo
      await NotificationService.sendNotification(profile.email, subject, body)

      console.log(
        `📨 Correo enviado a ${profile.email} (quota ${quota.id}, estado ${quota.status})`
      )
    } catch (error) {
      console.error('❌ Error enviando correo de cuota:', error.message)
    }
  }
}
