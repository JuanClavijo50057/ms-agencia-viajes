import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Bill from 'App/Models/Bill';
import BillValidator from 'App/Validators/BillValidator';

export default class BillsController {
    public async findAll({response}:HttpContextContract){
        const bills = await Bill.all();
        return response.ok(bills)
    }

    public async create({request, response}: HttpContextContract) {
        const body = await request.validate(BillValidator);
        const bill = await Bill.create(body);
        return response.created(bill);
    }

    public async update({params, request, response}: HttpContextContract) {
        const body = request.body();
        if (!params.id) {
            throw new Error('Bill ID is required');
        }
        const bill = await Bill.find(params.id);
        if (!bill) {
            throw new Error('Bill not found');
        }
        bill.merge(body);
        await bill.save();
        return response.ok({
            status: 'success',
            message: 'Bill updated successfully',
            data: bill,
        });
    }

    public async delete({params, response}: HttpContextContract) {
        if (!params.id) {
            throw new Error('Bill ID is required');
        }
        const bill = await Bill.find(params.id);
        if (!bill) {
            throw new Error('Bill not found');
        }
        await bill.delete();
        return response.ok({
            status: 'success',
            message: 'Bill deleted successfully',
        });
    }  
}
