import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BadRequestException from 'App/Exceptions/BadRequestException';
import NotFoundException from 'App/Exceptions/NotFoundException';

import Vehicle from "App/Models/Vehicle";

export default class VehiclesController {
    public async create({ request, response }: HttpContextContract) {
        const body = request.body();
        const vehicle = await Vehicle.create(body);
        return response.created(vehicle);

    }
    public async update({ params, request, response }: HttpContextContract) {
        const body = request.body();
        if (!params.id) {
            throw new BadRequestException('Vehicle ID is required');
        }
        const vehicle = await Vehicle.find(params.id);
        if (!vehicle) {
            throw new NotFoundException('Vehicle not found');
        }
        vehicle.merge(body);
        await vehicle.save();
        return response.ok({
            status: 'success',
            message: 'Vehicle updated successfully',
            data: vehicle,
        });
    }
    public async delete({ params, response }: HttpContextContract) {
        if (!params.id) {
            throw new BadRequestException('Vehicle ID is required');
        }
        const vehicle = await Vehicle.find(params.id);
        if (!vehicle) {
            throw new NotFoundException('Vehicle not found');
        }
        await vehicle.delete();
        return response.ok({
            status: 'success',
            message: 'Vehicle deleted successfully',
        });

    }
    public async findAll({ response }: HttpContextContract) {
        const vehicles = await Vehicle.all();
        return response.ok(vehicles);
    }

}
