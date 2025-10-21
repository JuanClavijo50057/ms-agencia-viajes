import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import City from 'App/Models/City';
import axios from 'axios'

export default class CitiesController {
    public async chargeCities({}: HttpContextContract) {
        try {
            const response = await axios.get('https://api-colombia.com/api/v1/City?sortBy=name&sortDirection=asc')
            const cities = response.data;
            
            for (const city of cities) {
                await City.create({name: city.name, department_id: city.departmentId});
            }

            
        } catch (error) {
            console.log(error);
            
        }
    }
}
