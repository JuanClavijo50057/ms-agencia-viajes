import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Quota from 'App/Models/Quota'
import QuotaValidator from 'App/Validators/QuotaValidator';

export default class QuotasController {
    public async findAll({response}:HttpContextContract){
        const quotas = await Quota.query().preload('travelCustomer');
        return response.ok(quotas)
    }

    public async create({request, response}: HttpContextContract) {
        const body = await request.validate(QuotaValidator);
        const quota = await Quota.create(body);
        return response.created(quota);
    }

    public async update({params, request, response}: HttpContextContract) {
        const body = request.body();
        if (!params.id) {
            throw new Error('Quota ID is required');
        }
        const quota = await Quota.find(params.id);
        if (!quota) {
            throw new Error('Quota not found');
        }
        quota.merge(body);
        await quota.save();
        return response.ok({
            status: 'success',
            message: 'Quota updated successfully',
            data: quota,
        });
    }

    public async delete({params, response}: HttpContextContract) {
        if (!params.id) {
            throw new Error('Quota ID is required');
        }
        const quota = await Quota.find(params.id);
        if (!quota) {
            throw new Error('Quota not found');
        }
        await quota.delete();
        return response.ok({
            status: 'success',
            message: 'Quota deleted successfully',
        });
    }
}
