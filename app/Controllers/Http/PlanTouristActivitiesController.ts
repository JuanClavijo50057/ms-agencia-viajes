import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BadRequestException from 'App/Exceptions/BadRequestException'
import NotFoundException from 'App/Exceptions/NotFoundException'
import PlanTouristActivity from 'App/Models/PlanTouristActivity'
import PlanTouristActivityValidator from 'App/Validators/PlanTouristActivityValidator'

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
}
