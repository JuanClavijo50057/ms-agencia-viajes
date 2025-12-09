import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Customer from 'App/Models/Customer';
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

    public async findTravelCustomersinPaymentOrPaid({ params, response }: HttpContextContract) {
        const user_id = params.userId;

        if (!user_id) {
            return response.status(400).send({
                status: "error",
                message: "userId must be a valid number",
            });
        }

        const customers = await Customer.findBy("user_id", user_id);

        if (!customers) {
            return response.status(404).send({
                status: "error",
                message: "Customer not found for the given userId",
            });
        }

        const travelCustomers = await TravelCustomer.query()
            .where("customer_id", customers.id)
            .andWhere((query) => {
                query
                    .where("status", "inPayment")
                    .orWhere("status", "paid");
            })
            .preload("customer")
            .preload("travel")
            .preload("quotas");

            return response.ok({
                status: "success",
                data: travelCustomers,
            });
    }
}
