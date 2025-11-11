import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Hotel from 'App/Models/Hotel';
import HotelValidator from 'App/Validators/HotelValidator';

export default class HotelsController {
    public async getHotelsByCity({ params, response }: HttpContextContract) {
        if (!params.cityId) {
            return response.badRequest('City ID is required');
        }
        const hotels = await Hotel.query().where('city_id', params.cityId)
        .whereHas('rooms', (roomQuery) => {
            roomQuery.where('is_available', true);
        });
        return response.ok(hotels);
    }
    public async create({ request, response }: HttpContextContract) {
        const body = await request.validate(HotelValidator);
        const hotel = await Hotel.create(body);
        return response.created(hotel);
    }
    public async findAll({ response }: HttpContextContract) {
        const hotels = await Hotel.all();
        return response.ok(hotels);
    }
}
