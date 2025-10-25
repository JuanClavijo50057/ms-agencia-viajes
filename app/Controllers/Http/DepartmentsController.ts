import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Department from 'App/Models/Department';
import axios from 'axios';

export default class DepartmentsController {
    public async chargeDepartments({ response }: HttpContextContract) {
        try {
            const responseApi = await axios.get('https://api-colombia.com/api/v1/Department')
            const departments = responseApi.data as any[];
            console.log(departments.length);
            
            for (const department of departments) {
                await Department.create({ id: department.id, name: department.name, population: department.population });
            }
            response.send(departments);
            response.status(200).send('Departments loaded successfully');
        } catch (error) {
            response.status(500).send('Error loading departments');
            console.log(error);
        }
    }
    public async findAll({ response }: HttpContextContract) {
        try {
            const departments = await Department.all();
            return response.status(200).send(departments);
        } catch (error) {
            response.status(500).send('Error fetching departments');
            console.log(error);
        }
    }

}
