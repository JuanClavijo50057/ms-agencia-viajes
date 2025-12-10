import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Quota from 'App/Models/Quota'
import { generateInvoicePDF } from 'App/Services/InvoiceService';
import QuotaValidator from 'App/Validators/QuotaValidator';
import axios from 'axios';
import { DateTime } from 'luxon';

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
        const quota = await Quota.create({ amount: body.amount, number_payments: body.number_payments, travel_customer_id: body.travel_customer_id, due_date: body.due_date });
        if (quota && body.isPayQuota) {
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

        const pdfBuffer = await generateInvoicePDF(body)

        try {
            await axios.post('http://localhost:5001/notifications/send', {
            email: body.x_customer_email,
            subject: `Factura electrónica - ${body.x_description}`,
            message: 'Gracias por tu pago. Adjunto encontrarás tu factura electrónica.',
            attachments: [
                {
                filename: `factura_${body.x_id_factura}.pdf`,
                content: pdfBuffer.toString('base64'),
                },
            ],
            })

            console.log('📧 Factura enviada correctamente al cliente.')
        } catch (error) {
            console.error('❌ Error enviando correo:', error.message)
        }
    }

    public async getQuotasByAmount({ params, response }: HttpContextContract) {
        const { amount } = params;
        const { travel_customer_id } = params;

        console.log('Parámetros recibidos:', { amount, travel_customer_id });

        if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
            return response.badRequest({ message: 'El parámetro "amount" es inválido.' });
        }

        if (!travel_customer_id || isNaN(Number(travel_customer_id)) || Number(travel_customer_id) <= 0) {
            return response.badRequest({ message: 'El parámetro "travel_customer_id" es inválido.' });
        }

        // Cantidad máxima de cuotas (4)
        const quotas: Quota[] = [];
        const maxQuotas = 4;

        for (let i = 1; i <= maxQuotas; i++) {
            const quota = new Quota();
            quota.amount = Math.round(Number(amount) / i);
            quota.number_payments = 1;
            quota.travel_customer_id = Number(travel_customer_id);
            quota.status = 'pending';
            quota.due_date = DateTime.now();
            quotas.push(quota);
        }

        return response.ok(quotas);
    }
}
