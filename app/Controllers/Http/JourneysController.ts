import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BadRequestException from 'App/Exceptions/BadRequestException';
import NotFoundException from 'App/Exceptions/NotFoundException';

import Journey from "App/Models/Journey";
import JourneyValidator from 'App/Validators/JourneyValidator';

export default class JourneysController {
    public async create({ request, response }: HttpContextContract) {
        const body = await request.validate(JourneyValidator);
        const journey = await Journey.create(body);
        return response.created(journey);
    }
    public async update({ params, request, response }: HttpContextContract) {
        const body = request.body();
        if (!params.id) {
            throw new BadRequestException('Journey ID is required');
        }
        const journey = await Journey.find(params.id);
        if (!journey) {
            throw new NotFoundException('Journey not found');
        }
        journey.merge(body);
        await journey.save();
        return response.ok({
            status: 'success',
            message: 'Journey updated successfully',
            data: journey,
        });

    }
    public async delete({ params, response }: HttpContextContract) {
        if (!params.id) {
            throw new BadRequestException('Journey ID is required');
        }
        const journey = await Journey.find(params.id);
        if (!journey) {
            throw new NotFoundException('Journey not found');
        }
        await journey.delete();
        return response.ok({
            status: 'success',
            message: 'Journey deleted successfully',
        });

    }
    public async findAll({ response }: HttpContextContract) {
    const journeys = await Journey
        .query()
        .preload('origin')
        .preload('destination')

    return response.ok(journeys)
    }
}
