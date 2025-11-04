import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { CreateCustomerDTO } from 'App/DTOs/Customer/createCustomerDTO';
import BadRequestException from 'App/Exceptions/BadRequestException';
import NotFoundException from 'App/Exceptions/NotFoundException';
import Customer from 'App/Models/Customer';
import CustomerValidator from 'App/Validators/CustomerValidator';

export default class CustomersController {
    public async findAll({response}:HttpContextContract){
        const customers = Customer.all();
        return response.ok(customers)
    }

    public async create({request, response}: HttpContextContract) {
        const body:CreateCustomerDTO = await request.validate(CustomerValidator);
        const customer = Customer.create(body);
        return response.created(customer);
    }

    public async update({params, request, response}: HttpContextContract) {
        const body = request.body();
        if (!params.id) {
            throw new BadRequestException('Customer ID is required');
        }
        const customer = await Customer.find(params.id);
        if (!customer) {
            throw new NotFoundException('Customer not found');
        }
        customer.merge(body);
        await customer.save();
        return response.ok({
            status: 'success',
            message: 'Customer updated successfully',
            data: customer,
        });
    }

    public async delete({params, response}: HttpContextContract){
        if (!params.id) {
            throw new BadRequestException('Customer ID required')
        }
        const customer = await Customer.find(params.id);
        if (!customer) {
            throw new NotFoundException('Customer not found');
        };
        await customer.delete();
        return response.ok({
            status: 'success',
            message: 'Customer deleted successfully',
        });
    }
}
