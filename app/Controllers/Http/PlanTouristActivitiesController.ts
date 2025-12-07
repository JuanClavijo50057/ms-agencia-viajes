import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BadRequestException from 'App/Exceptions/BadRequestException'
import NotFoundException from 'App/Exceptions/NotFoundException'
import Plan from 'App/Models/Plan'
import PlanTouristActivity from 'App/Models/PlanTouristActivity'
import PlanTouristActivitieCreateValidator from 'App/Validators/PlanTouristActivitieCreateValidator'
import PlanTouristActivityValidator from 'App/Validators/PlanTouristActivityValidator'
import { request } from 'https'

export default class PlanTouristActivitiesController {
    public async findAll({ response }: HttpContextContract) {
        const planTouristActivities = await PlanTouristActivity.all()
        return response.ok(planTouristActivities)
    }

    public async findById({ params, response }: HttpContextContract) {
        if (!params.id) {
            throw new BadRequestException('PlanTouristActivity ID is required')
        }
        const planTouristActivity = await PlanTouristActivity.find(params.id)
        if (!planTouristActivity) {
            throw new NotFoundException('PlanTouristActivity not found')
        }
        return response.ok(planTouristActivity)
    }

    public async findByPlan({ params, response }: HttpContextContract) {
        if (!params.planId) {
            throw new BadRequestException('Plan ID is required')
        }
        const planTouristActivities = await PlanTouristActivity.query().where('plan_id', params.planId)
        return response.ok(planTouristActivities)
    }

    public async findByActivity({ params, response }: HttpContextContract) {
        if (!params.activityId) {
            throw new BadRequestException('Activity ID is required')
        }
        const planTouristActivities = await PlanTouristActivity.query().where('tourist_activity_id', params.activityId)
        return response.ok(planTouristActivities)
    }

    public async create({ request, response }: HttpContextContract) {
        const body = await request.validate(PlanTouristActivityValidator)
        const planTouristActivity = await PlanTouristActivity.create(body)
        return response.created(planTouristActivity)
    }

    public async update({ params, request, response }: HttpContextContract) {
        const body = request.body()
        if (!params.id) {
            throw new BadRequestException('PlanTouristActivity ID is required')
        }
        const planTouristActivity = await PlanTouristActivity.find(params.id)
        if (!planTouristActivity) {
            throw new NotFoundException('PlanTouristActivity not found')
        }
        planTouristActivity.merge(body)
        await planTouristActivity.save()
        return response.ok({
            status: 'success',
            message: 'PlanTouristActivity updated successfully',
            data: planTouristActivity,
        })
    }

    public async delete({ params, response }: HttpContextContract) {
        if (!params.id) {
            throw new BadRequestException('PlanTouristActivity ID is required')
        }
        const planTouristActivity = await PlanTouristActivity.find(params.id)
        if (!planTouristActivity) {
            throw new NotFoundException('PlanTouristActivity not found')
        }
        await planTouristActivity.delete()
        return response.ok({
            status: 'success',
            message: 'PlanTouristActivity deleted successfully',
        })
    }
    public async finPlansByCity({ params, response }: HttpContextContract) {
        const { cityId } = params

        if (!cityId) {
            return response.badRequest({ message: 'City ID is required' })
        }

        // Traemos todas las asociaciones plan-actividad de esa ciudad
        const planTouristActivities = await PlanTouristActivity
            .query()
            .preload('touristActivity', (activityQuery) => {
                activityQuery.where('city_id', cityId)
            })
            .preload('plan')

        // Agrupamos los resultados por plan
        const grouped: Record<number, { id: number; name: string; description: string | null, duration_days: number, is_active: boolean; activities: any[]; total_cost: number }> = {}

        for (const record of planTouristActivities) {
            const plan = record.plan
            const activity = record.touristActivity

            if (!plan || !activity) continue

            // Si el plan no está aún en el grupo, se crea
            if (!grouped[plan.id]) {
                grouped[plan.id] = {
                    id: plan.id,
                    name: plan.name,
                    description: plan.description,
                    duration_days: plan.duration_days,
                    is_active: plan.is_active,
                    activities: [],
                    total_cost: 0,
                }
            }

            grouped[plan.id].activities.push({
                id: activity.id,
                name: activity.name,
                cost: activity.price,
            })

            grouped[plan.id].total_cost += Number(activity.price || 0)
        }

        // Convertimos el objeto agrupado a arreglo
        const result = Object.values(grouped)

        return response.ok(result)
    }
    public async createPlanWhitActivities({ response, request }: HttpContextContract) {
        const body = await request.validate(PlanTouristActivitieCreateValidator)
        const bodyPlan = { name: body.name, description: body.description, duration_days: body.duration_days, is_active: body.is_active ,price: body.price}
        const plan = await Plan.create(bodyPlan)
        const planActivitiesData = body.activities.map((activityId) => ({
            plan_id: plan.id,
            tourist_activity_id: activityId,
        }))

        await PlanTouristActivity.createMany(planActivitiesData)
        return response.created({ plan, message: 'Plan with activities created successfully' })
    }

}
