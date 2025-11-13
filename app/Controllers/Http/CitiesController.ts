import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BadRequestException from 'App/Exceptions/BadRequestException';
import City from 'App/Models/City';
import axios from 'axios'

export default class CitiesController {
    public async chargeCities({ response }: HttpContextContract) {
        const responseApi = await axios.get('https://api-colombia.com/api/v1/City?sortBy=name&sortDirection=asc')
        const cities = responseApi.data;

        for (const city of cities) {
            await City.create({ id: city.id, name: city.name, department_id: city.departmentId });
        }
        response.created(cities);

    }
    public async find({ params, response }: HttpContextContract) {
        if (!params.idDepartment) {
            return new BadRequestException('Department ID is required');
        }
        const cities = await City.query().where('department_id', params.idDepartment).select('id', 'name');
        return response.ok(cities);
    }
    public async findByHotelAvailable({ params, response }: HttpContextContract) {
        if (!params.idDepartment) {
            return new BadRequestException('Department ID is required');
        }
        const cities = await City
            .query()
            .where('department_id', params.idDepartment)
            .whereHas('hotels', (hotelQuery) => {
                hotelQuery.whereHas('rooms', (roomQuery) => {
                    roomQuery.where('is_available', true)
                })
            })
        return response.ok(cities);
    }
    public async findAll({ response }: HttpContextContract) {
        const cities = await City.all();
        return response.ok(cities);
    }
}

