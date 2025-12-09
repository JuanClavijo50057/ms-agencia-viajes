import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database';
import Customer from 'App/Models/Customer';
import TravelCustomer from 'App/Models/TravelCustomer'
import TravelCustomerValidator from 'App/Validators/TravelCustomerValidator';

export default class TravelCustomersController {
    public async findAll({ response }: HttpContextContract) {
        const travelCustomers = await TravelCustomer.all();
        return response.ok(travelCustomers)
    }


     public async create(ctx: HttpContextContract) {
    const { request, response } = ctx

    const payload = request.only(['travel_id', 'customer_id']) // customer_id = user_id del ms_security

    const customer = await Database
      .from('customers')
      .where('user_id', payload.customer_id)
      .select('id')
      .first()

    if (!customer) {
      return response.badRequest({
        message: 'El usuario no tiene un perfil de cliente registrado',
      })
    }

    payload.customer_id = customer.id

    const data = await request.validate({
      schema: new TravelCustomerValidator(ctx).schema,
      data: payload,
    })

    // 5️⃣ Crear registro
    const travelCustomer = await TravelCustomer.create(data)

    return response.ok({
      message: 'Cliente asociado correctamente al viaje',
      travelCustomer,
    })
  }
    public async update({ params, request, response }: HttpContextContract) {
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

    public async delete({ params, response }: HttpContextContract) {
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
