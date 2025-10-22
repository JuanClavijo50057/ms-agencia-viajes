import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import City from 'App/Models/City';
import axios from 'axios'

export default class CitiesController {
    public async chargeCities({response }: HttpContextContract) {
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
    public async getCities({ }: HttpContextContract) {
    }
}
