import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Quota from 'App/Models/Quota'
import QuotaValidator from 'App/Validators/QuotaValidator';
import { log } from 'console';

export default class QuotasController {
    public async findAll({ response }: HttpContextContract) {
        const quotas = await Quota.query().preload('travelCustomer');
        return response.ok(quotas)
    }
    public async createPayment({ params, response }: HttpContextContract) {
        const quota = await Quota.findOrFail(params.id)

        if (quota.status === 'paid') {
            return response.badRequest({ message: 'Esta cuota ya fue pagada' })
        }

        const invoice = quota.id
        const amount = quota.amount

        return response.ok({
            invoice,
            publicKey: process.env.EPAY_PUBLIC_KEY,
            test: (process.env.EPAY_TEST || 'true') === 'true',
            responseUrl: process.env.EPAY_RESPONSE_URL,
            confirmationUrl: process.env.EPAY_CONFIRMATION_URL,
            description: `Pago de cuota ${quota.id}`,
            amount,
            currency: 'COP',
            external: 'true',
        })
    }


    public async create({ request, response }: HttpContextContract) {
        const body = await request.validate(QuotaValidator);
        const quota = await Quota.create(body);
        return response.created(quota);
    }

    public async update({ params, request, response }: HttpContextContract) {
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

    public async delete({ params, response }: HttpContextContract) {
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
    public async webhook({ request, response }: HttpContextContract) {
        const body = request.all()
        console.log('🛰️ Webhook recibido:', body)
        const idQuota = Number(body.x_id_factura)
        const quota = await Quota.find(idQuota)
        if (!quota) {
            console.log(`❌ Cuota con ID ${idQuota} no encontrada.`)
            return response.status(404)
        }
        if (body.x_respuesta === 'Aceptada') {
            quota.status = 'paid'
            await quota.save()
            console.log(`✅ Cuota con ID ${idQuota} marcada como pagada.`)
        }
    }

}
