import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Travel from 'App/Models/Travel';
import TravelValidator from 'App/Validators/TravelValidator';

export default class TravelsController {
    public async findAll({response}:HttpContextContract){
        const travels = await Travel.all();
        return response.ok(travels)
    }

    public async create({request, response}: HttpContextContract) {
        const body = await request.validate(TravelValidator);
        const travel = await Travel.create(body);
        return response.created(travel);
    }

    public async update({params, request, response}: HttpContextContract) {
        const body = await request.validate(TravelValidator);
        if (!params.id) {
            throw new Error('Travel ID is required');
        }
        const travel = await Travel.find(params.id);
        if (!travel) {
            throw new Error('Travel not found');
        }
        travel.merge(body);
        await travel.save();
        return response.ok({
            status: 'success',
            message: 'Travel updated successfully',
            data: travel,
        });
    }

    public async delete({params, response}: HttpContextContract) {
        if (!params.id) {
            throw new Error('Travel ID is required');
        }
        const travel = await Travel.find(params.id);
        if (!travel) {
            throw new Error('Travel not found');
        }
        await travel.delete();
        return response.ok({
            status: 'success',
            message: 'Travel deleted successfully',
        });
    }
}
