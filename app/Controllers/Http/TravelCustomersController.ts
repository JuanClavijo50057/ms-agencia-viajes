import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import TravelCustomer from 'App/Models/TravelCustomer'
import TravelCustomerValidator from 'App/Validators/TravelCustomerValidator';

export default class TravelCustomersController {
    public async findAll({response}:HttpContextContract){
        const travelCustomers = await TravelCustomer.all();
        return response.ok(travelCustomers)
    }

    public async create({request, response}: HttpContextContract) {
        const body = await request.validate(TravelCustomerValidator);
        const travelCustomer = await TravelCustomer.create(body);
        return response.created(travelCustomer);
    }

    public async update({params, request, response}: HttpContextContract) {
        const body = request.body();
        if (!params.id) {
            throw new Error('TravelCustomer ID is required');
        }
        const travelCustomer = await TravelCustomer.find(params.id);
        if (!travelCustomer) {
            throw new Error('TravelCustomer not found');
        }
        travelCustomer.merge(body);
        await travelCustomer.save();
        return response.ok({
            status: 'success',
            message: 'TravelCustomer updated successfully',
            data: travelCustomer,
        });
    }

    public async delete({params, response}: HttpContextContract) {
        if (!params.id) {
            throw new Error('TravelCustomer ID is required');
        }
        const travelCustomer = await TravelCustomer.find(params.id);
        if (!travelCustomer) {
            throw new Error('TravelCustomer not found');
        }
        await travelCustomer.delete();
        return response.ok({
            status: 'success',
            message: 'TravelCustomer deleted successfully',
        });
    }
}
