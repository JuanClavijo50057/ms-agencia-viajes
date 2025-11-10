import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BadRequestException from 'App/Exceptions/BadRequestException'
import NotFoundException from 'App/Exceptions/NotFoundException'
import TouristActivity from 'App/Models/TouristActivity'
import TouristActivityValidator from 'App/Validators/TouristActivityValidator'

export default class TouristActivitiesController {
    public async findAll({ response }: HttpContextContract) {
        const activities = await TouristActivity.all()
        return response.ok(activities)
    }

    public async findByCity({ params, response }: HttpContextContract) {
        if (!params.cityId) {
            throw new BadRequestException('City ID is required')
        }
        const activities = await TouristActivity.query().where('city_id', params.cityId)
        return response.ok(activities)
    }

    public async findActive({ response }: HttpContextContract) {
        const activities = await TouristActivity.query().where('is_active', true)
        return response.ok(activities)
    }

    public async create({ request, response }: HttpContextContract) {
        const body = await request.validate(TouristActivityValidator)
        const activity = await TouristActivity.create(body)
        return response.created(activity)
    }

    public async update({ params, request, response }: HttpContextContract) {
        const body = request.body()
        if (!params.id) {
            throw new BadRequestException('Activity ID is required')
        }
        const activity = await TouristActivity.find(params.id)
        if (!activity) {
            throw new NotFoundException('Tourist activity not found')
        }
        activity.merge(body)
        await activity.save()
        return response.ok({
            status: 'success',
            message: 'Tourist activity updated successfully',
            data: activity,
        })
    }

    public async delete({ params, response }: HttpContextContract) {
        if (!params.id) {
            throw new BadRequestException('Activity ID is required')
        }
        const activity = await TouristActivity.find(params.id)
        if (!activity) {
            throw new NotFoundException('Tourist activity not found')
        }
        await activity.delete()
        return response.ok({
            status: 'success',
            message: 'Tourist activity deleted successfully',
        })
    }
}
