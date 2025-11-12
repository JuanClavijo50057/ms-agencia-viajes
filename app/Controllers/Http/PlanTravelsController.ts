import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BadRequestException from 'App/Exceptions/BadRequestException'
import NotFoundException from 'App/Exceptions/NotFoundException'
import PlanTravel from 'App/Models/PlanTravel'
import PlanTravelValidator from 'App/Validators/PlanTravelValidator'

export default class PlanTravelsController {
    public async findAll({ response }: HttpContextContract) {
        const planTravels = await PlanTravel.all()
        return response.ok(planTravels)
    }

    public async findById({ params, response }: HttpContextContract) {
        if (!params.id) {
            throw new BadRequestException('PlanTravel ID is required')
        }
        const planTravel = await PlanTravel.find(params.id)
        if (!planTravel) {
            throw new NotFoundException('PlanTravel not found')
        }
        return response.ok(planTravel)
    }

    public async findByPlan({ params, response }: HttpContextContract) {
        if (!params.planId) {
            throw new BadRequestException('Plan ID is required')
        }
        const planTravels = await PlanTravel.query().where('plan_id', params.planId)
        return response.ok(planTravels)
    }

    public async findByTravel({ params, response }: HttpContextContract) {
        if (!params.travelId) {
            throw new BadRequestException('Travel ID is required')
        }
        const planTravels = await PlanTravel.query().where('travel_id', params.travelId)
        return response.ok(planTravels)
    }

    public async create({ request, response }: HttpContextContract) {
        const body = await request.validate(PlanTravelValidator)
        const planTravel = await PlanTravel.create(body)
        return response.created(planTravel)
    }

    public async update({ params, request, response }: HttpContextContract) {
        const body = request.body()
        if (!params.id) {
            throw new BadRequestException('PlanTravel ID is required')
        }
        const planTravel = await PlanTravel.find(params.id)
        if (!planTravel) {
            throw new NotFoundException('PlanTravel not found')
        }
        planTravel.merge(body)
        await planTravel.save()
        return response.ok({
            status: 'success',
            message: 'PlanTravel updated successfully',
            data: planTravel,
        })
    }

    public async delete({ params, response }: HttpContextContract) {
        if (!params.id) {
            throw new BadRequestException('PlanTravel ID is required')
        }
        const planTravel = await PlanTravel.find(params.id)
        if (!planTravel) {
            throw new NotFoundException('PlanTravel not found')
        }
        await planTravel.delete()
        return response.ok({
            status: 'success',
            message: 'PlanTravel deleted successfully',
        })
    }
}
