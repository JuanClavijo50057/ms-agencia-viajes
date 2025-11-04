import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BadRequestException from 'App/Exceptions/BadRequestException';
import NotFoundException from 'App/Exceptions/NotFoundException';
import User from 'App/Models/User';

export default class UsersController {
    public async findAll({response}:HttpContextContract){
        const Users = User.all();
        return response.ok(Users)
    }

    public async create({request, response}: HttpContextContract) {
        const body = request.body();
        const user = User.create(body);
        return response.created(user);
    }

    public async update({params, request, response}: HttpContextContract) {
        const body = request.body();
        if (!params.id) {
            throw new BadRequestException('User ID is required');
        }
        const user = await User.find(params.id);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        user.merge(body);
        await user.save();
        return response.ok({
            status: 'success',
            message: 'User updated successfully',
            data: user,
        });
    }

    public async delete({params, response}: HttpContextContract){
        if (!params.id) {
            throw new BadRequestException('User ID required')
        }
        const user = await User.find(params.id);
        if (!user) {
            throw new NotFoundException('User not found');
        };
        await user.delete();
        return response.ok({
            status: 'success',
            message: 'User deleted successfully',
        });
    }
}