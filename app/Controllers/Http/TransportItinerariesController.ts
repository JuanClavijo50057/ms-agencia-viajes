import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import TransportItinerary from 'App/Models/TransportItinerary';

export default class TransportItinerariesController {
    public async findAll({response}:HttpContextContract){
        const TransportItineraries = TransportItinerary.all();
        return response.ok(TransportItineraries)
    }

    public async create({response, request}:HttpContextContract){
        const body = await request.validate(TransportItineraryValidator);
        const transportItinerary = await TransportItinerary.create(body)
        return response.created(transportItinerary)
    }

    public async update({response, request, params}: HttpContextContract){
        const body = await request.body();
        if (!params.id) {
            throw new Error('Transport Itinerary ID is required');
        }
        const transportItinerary = await TransportItinerary.find(params.id)
        if (!transportItinerary){
            throw new Error('Transport Itinerary not found');
        }
        transportItinerary.merge(body);
        await transportItinerary.save();
        return response.ok({
            status: 'success',
            message: 'Transport Itinerary updated successfully',
            data: transportItinerary, 
        })
    }

    public async delete({response, params}: HttpContextContract){
        const transportItinerary = await TransportItinerary.find(params.id);
        if (!transportItinerary) {
            throw new Error('Transport Itinerary not found');
        }
        await transportItinerary.delete()
        return response.ok({
            status: 'success',
            message: 'Transport Itinerary deleted successfully',
        })
    }
}