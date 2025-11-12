import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BadRequestException from 'App/Exceptions/BadRequestException'
import NotFoundException from 'App/Exceptions/NotFoundException'
import Hotel from 'App/Models/Hotel';
import HotelValidator from 'App/Validators/HotelValidator';

export default class HotelsController {
    public async findAll({ response }: HttpContextContract) {
        const hotels = await Hotel.all();
        return response.ok(hotels);
    }

    public async findById({ params, response }: HttpContextContract) {
        if (!params.id) {
            throw new BadRequestException('Hotel ID is required')
        }
        const hotel = await Hotel.find(params.id)
        if (!hotel) {
            throw new NotFoundException('Hotel not found')
        }
        return response.ok(hotel)
    }

    public async getHotelsByCity({ params, response }: HttpContextContract) {
        if (!params.cityId) {
            throw new BadRequestException('City ID is required')
        }
        const hotels = await Hotel.query().where('city_id', params.cityId)
            .whereHas('rooms', (roomQuery) => {
                roomQuery.where('is_available', true);
            });
        return response.ok(hotels);
    }

    public async findByStars({ params, response }: HttpContextContract) {
        if (!params.stars) {
            throw new BadRequestException('Stars rating is required')
        }
        const hotels = await Hotel.query().where('stars', params.stars)
        return response.ok(hotels)
    }

    public async create({ request, response }: HttpContextContract) {
        const body = await request.validate(HotelValidator);
        const hotel = await Hotel.create(body);
        return response.created(hotel);
    }

    public async update({ params, request, response }: HttpContextContract) {
        const body = request.body()
        if (!params.id) {
            throw new BadRequestException('Hotel ID is required')
        }
        const hotel = await Hotel.find(params.id)
        if (!hotel) {
            throw new NotFoundException('Hotel not found')
        }
        hotel.merge(body)
        await hotel.save()
        return response.ok({
            status: 'success',
            message: 'Hotel updated successfully',
            data: hotel,
        })
    }

    public async delete({ params, response }: HttpContextContract) {
        if (!params.id) {
            throw new BadRequestException('Hotel ID is required')
        }
        const hotel = await Hotel.find(params.id)
        if (!hotel) {
            throw new NotFoundException('Hotel not found')
        }
        await hotel.delete()
        return response.ok({
            status: 'success',
            message: 'Hotel deleted successfully',
        })
    }
}
