import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BadRequestException from 'App/Exceptions/BadRequestException';
import ServiceTransportation from 'App/Models/ServiceTransportation';
import ServiceTransportationValidator from 'App/Validators/ServiceTransportationValidator';

export default class ServiceTransportationsController {
    public async findAll({ response }: HttpContextContract) {
        const transportations = await ServiceTransportation
            .query()
            .preload('vehicle')
            .preload('journey', (journeyQuery) => {
                journeyQuery.preload('origin');
                journeyQuery.preload('destination');
            });
        return response.ok(transportations);
    }
    

    public async create({ request, response }: HttpContextContract) {
        try {
            const body = await request.validate(ServiceTransportationValidator);
            const transportation = await ServiceTransportation.create(body);
            return response.created(transportation);
        } catch (error) {
            return response.badRequest(error.messages);
        }
    }

    public async update({ params, request, response }: HttpContextContract) {
        const body = await request.validate(ServiceTransportationValidator);
        if (!params.id) {
            throw new Error('Transportation ID is required');
        }
        const serviceTransportation = await ServiceTransportation.find(params.id);
        if (!serviceTransportation) {
            throw new Error('Transportation not found');
        }
        const transportation = serviceTransportation.merge(body);
        await transportation.save();
        return response.ok(transportation);
    }

    public async delete({ params, response }: HttpContextContract) {
        if (!params.id) {
            throw new BadRequestException('Transportation ID is required');
        }
        const serviceTransportation = await ServiceTransportation.find(params.id);
        if (!serviceTransportation) {
            throw new BadRequestException('Transportation not found');
        }
        await serviceTransportation.delete();
        return response.noContent();
    }
}
