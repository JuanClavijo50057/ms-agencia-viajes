import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BadRequestException from 'App/Exceptions/BadRequestException'
import NotFoundException from 'App/Exceptions/NotFoundException'
import Plan from 'App/Models/Plan'
import PlanValidator from 'App/Validators/PlanValidator'

export default class PlansController {
    public async findAll({ response }: HttpContextContract) {
        const plans = await Plan.all()
        return response.ok(plans)
    }

    public async findActive({ response }: HttpContextContract) {
        const plans = await Plan.query().where('is_active', true)
        return response.ok(plans)
    }

    public async findByDuration({ params, response }: HttpContextContract) {
        if (!params.days) {
            throw new BadRequestException('Duration in days is required')
        }
        const plans = await Plan.query().where('duration_days', params.days)
        return response.ok(plans)
    }

    public async findByPriceRange({ request, response }: HttpContextContract) {
        const { min_price, max_price } = request.qs()
        if (!min_price || !max_price) {
            throw new BadRequestException('Min and max price are required')
        }
        const plans = await Plan.query()
            .whereBetween('price', [min_price, max_price])
        return response.ok(plans)
    }

    public async create({ request, response }: HttpContextContract) {
        const body = await request.validate(PlanValidator)
        const plan = await Plan.create(body)
        return response.created(plan)
    }

    public async update({ params, request, response }: HttpContextContract) {
        const body = request.body()
        if (!params.id) {
            throw new BadRequestException('Plan ID is required')
        }
        const plan = await Plan.find(params.id)
        if (!plan) {
            throw new NotFoundException('Plan not found')
        }
        plan.merge(body)
        await plan.save()
        return response.ok({
            status: 'success',
            message: 'Plan updated successfully',
            data: plan,
        })
    }

    public async delete({ params, response }: HttpContextContract) {
        if (!params.id) {
            throw new BadRequestException('Plan ID is required')
        }
        const plan = await Plan.find(params.id)
        if (!plan) {
            throw new NotFoundException('Plan not found')
        }
        await plan.delete()
        return response.ok({
            status: 'success',
            message: 'Plan deleted successfully',
        })
    }
}
