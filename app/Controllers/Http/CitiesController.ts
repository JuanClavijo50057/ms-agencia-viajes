import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import City from 'App/Models/City';
import axios from 'axios'

export default class CitiesController {
    public async chargeCities({ response }: HttpContextContract) {
        try {
            const responseApi = await axios.get('https://api-colombia.com/api/v1/City?sortBy=name&sortDirection=asc')
            const cities = responseApi.data;

            for (const city of cities) {
                await City.create({ id: city.id, name: city.name, department_id: city.departmentId });
            }
            response.status(200).send('Cities loaded successfully');
        } catch (error) {
            response.status(500).send('Error loading cities');
        }
    }
    public async find({ params, response }: HttpContextContract) {
        if (!params.idDepartment) {
            return response.status(400).send('Department ID is required');
        }
        try {
            const cities = await City.query().where('department_id', params.idDepartment);
            return response.status(200).send(cities);
        } catch (error) {
            response.status(500).send('Error fetching cities');
            console.log(error);
        }
    }
}
