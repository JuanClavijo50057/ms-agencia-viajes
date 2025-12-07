import { DateTime } from 'luxon'
import { afterCreate, afterDelete, afterUpdate, BaseModel, beforeCreate, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Plan from './Plan'
import TouristActivity from './TouristActivity'
import Database from '@ioc:Adonis/Lucid/Database'
import InvalidCityException from 'App/Exceptions/InvalidCityException'

export default class PlanTouristActivity extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public plan_id: number

  @column()
  public tourist_activity_id: number

  @belongsTo(() => Plan, {
    foreignKey: 'plan_id',
  })
  public plan: BelongsTo<typeof Plan>

  @belongsTo(() => TouristActivity, {
    foreignKey: 'tourist_activity_id',
  })
  public touristActivity: BelongsTo<typeof TouristActivity>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeCreate()
  public static async validateCityConsistency(record: PlanTouristActivity) {
    // Buscar la ciudad de la actividad que intenta insertarse
    const activity = await Database
      .from('tourist_activities')
      .select('city_id')
      .where('id', record.tourist_activity_id)
      .first()

    if (!activity) {
      throw new Error('La actividad turística no existe')
    }

    // Buscar la ciudad de alguna actividad ya existente del plan
    const existing = await Database
      .from('plan_tourist_activities as pta')
      .join('tourist_activities as ta', 'ta.id', 'pta.tourist_activity_id')
      .where('pta.plan_id', record.plan_id)
      .select('ta.city_id')
      .first()

    // Si el plan ya tiene actividades y la ciudad es distinta, lanzar error
    if (existing && existing.city_id !== activity.city_id) {
      throw new InvalidCityException(
        `No se puede agregar esta actividad porque pertenece a otra ciudad (plan_id: ${record.plan_id})`
      )
    }
  }

  @afterCreate()
  @afterUpdate()
  @afterDelete()
  public static async recalculatePlanPrice(record: PlanTouristActivity) {
    if (!record.plan_id) return

    // 1️⃣ Calculamos el total primero
    const result = await Database
      .from('plan_tourist_activities as pta')
      .join('tourist_activities as ta', 'ta.id', 'pta.tourist_activity_id')
      .where('pta.plan_id', record.plan_id)
      .sum('ta.price as total')
      .first()

    // 2️⃣ Forzamos a número y asignamos 0 si es null
    const total = Number(result?.total) || 0

    // 3️⃣ Actualizamos el plan con el valor numérico real
    await Database
      .from('plans')
      .where('id', record.plan_id)
      .update({ price: total })
  }
}
