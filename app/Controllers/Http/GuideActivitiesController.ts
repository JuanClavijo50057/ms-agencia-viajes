import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BadRequestException from 'App/Exceptions/BadRequestException'
import NotFoundException from 'App/Exceptions/NotFoundException'
import GuideActivity from 'App/Models/GuideActivity'
import GuideActivityValidator from 'App/Validators/GuideActivityValidator'

export default class GuideActivitiesController {
    public async findAll({ response }: HttpContextContract) {
        const guideActivities = await GuideActivity.all()
        return response.ok(guideActivities)
    }

    public async findByGuide({ params, response }: HttpContextContract) {
        if (!params.guideId) {
            throw new BadRequestException('Guide ID is required')
        }
        const guideActivities = await GuideActivity.query().where('guide_id', params.guideId)
        return response.ok(guideActivities)
    }

    public async findByActivity({ params, response }: HttpContextContract) {
        if (!params.activityId) {
            throw new BadRequestException('Activity ID is required')
        }
        const guideActivities = await GuideActivity.query().where('activity_id', params.activityId)
        return response.ok(guideActivities)
    }

    public async create({ request, response }: HttpContextContract) {
        const body = await request.validate(GuideActivityValidator)
        const guideActivity = await GuideActivity.create(body)
        return response.created(guideActivity)
    }

    public async update({ params, request, response }: HttpContextContract) {
        const body = request.body()
        if (!params.id) {
            throw new BadRequestException('GuideActivity ID is required')
        }
        const guideActivity = await GuideActivity.find(params.id)
        if (!guideActivity) {
            throw new NotFoundException('GuideActivity not found')
        }
        guideActivity.merge(body)
        await guideActivity.save()
        return response.ok({
            status: 'success',
            message: 'GuideActivity updated successfully',
            data: guideActivity,
        })
    }

    public async delete({ params, response }: HttpContextContract) {
        if (!params.id) {
            throw new BadRequestException('GuideActivity ID is required')
        }
        const guideActivity = await GuideActivity.find(params.id)
        if (!guideActivity) {
            throw new NotFoundException('GuideActivity not found')
        }
        await guideActivity.delete()
        return response.ok({
            status: 'success',
            message: 'GuideActivity deleted successfully',
        })
    }
}
