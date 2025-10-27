import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Department from 'App/Models/Department';
import axios from 'axios';

export default class DepartmentsController {
    public async chargeDepartments({ response }: HttpContextContract) {
        const responseApi = await axios.get('https://api-colombia.com/api/v1/Department')
        const departments = responseApi.data as any[];
        for (const department of departments) {
            await Department.create({ id: department.id, name: department.name, population: department.population });
        }
        response.created(departments);
    }
    public async findAll({ response }: HttpContextContract) {
        const departments = await Department.all();
        return response.ok(departments);
    }

}
