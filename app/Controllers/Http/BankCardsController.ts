import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BankCard from 'App/Models/BankCard'
import BankCardValidator from 'App/Validators/BankCardValidator';

export default class BankCardsController {
    public async findAll({response}:HttpContextContract){
        const bankCards = await BankCard.all();
        return response.ok(bankCards) 
    }

    public async findByCustomer({params, response}: HttpContextContract) {
        if (!params.idCustomer) {
            throw new Error('Customer ID is required');
        }
        const bankCards = await BankCard.query().where('customer_id', params.idCustomer);
        return response.ok(bankCards);
    }

    public async create({request, response}: HttpContextContract) {
        const body = await request.validate(BankCardValidator);
        const bankCard = await BankCard.create(body);
        return response.created(bankCard);
    }

    public async update({params, request, response}: HttpContextContract) {
        const body = request.body();
        if (!params.id) {
            throw new Error('BankCard ID is required');
        }
        const bankCard = await BankCard.find(params.id);
        if (!bankCard) {
            throw new Error('BankCard not found');
        }
        bankCard.merge(body);
        await bankCard.save();
        return response.ok({
            status: 'success',
            message: 'BankCard updated successfully',
            data: bankCard,
        });
    }

    public async delete({params, response}: HttpContextContract) {
        if (!params.id) {
            throw new Error('BankCard ID is required');
        }
        const bankCard = await BankCard.find(params.id);
        if (!bankCard) {
            throw new Error('BankCard not found');
        }
        await bankCard.delete();
        return response.ok({
            status: 'success',
            message: 'BankCard deleted successfully',
        });
    }
}
