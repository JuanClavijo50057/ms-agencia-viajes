import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { CreateAdministratorDTO } from 'App/DTOs/Administrator/createAdministratorDTO';
import BadRequestException from 'App/Exceptions/BadRequestException';
import NotFoundException from 'App/Exceptions/NotFoundException';

import User from "App/Models/User";
import AdministratorValidator from 'App/Validators/AdministratorValidator';

export default class AdministratorsController {
    public async findAll({response}: HttpContextContract){
        const Administrators = User.all();
        return response.ok(Administrators)
    }

    public async create({request, response}: HttpContextContract) {
        const body:CreateAdministratorDTO = await request.validate(AdministratorValidator);
        const administrator = User.create(body);
        return response.created(administrator);
    }

    public async update({params, request, response}: HttpContextContract) {
        const body = request.body();
        if (!params.id) {
            throw new BadRequestException('Administrator ID is required');
        }
        const administrator = await User.find(params.id);
        if (!administrator) {
            throw new NotFoundException('Administrator not found');
        }
        administrator.merge(body);
        await administrator.save();
        return response.ok({
            status: 'success',
            message: 'Administrator updated successfully',
            data: administrator,
        });
    }

    public async delete({params, response}: HttpContextContract){
        if (!params.id) {
            throw new BadRequestException('Administrator ID required')
        }
        const administrator = await User.find(params.id);
        if (!administrator) {
            throw new NotFoundException('Administrator not found');
        };
        await administrator.delete();
        return response.ok({
            status: 'success',
            message: 'Administrator deleted successfully',
        });
    }
}
