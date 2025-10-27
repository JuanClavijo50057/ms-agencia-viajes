import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { CreatePlaneDTO } from 'App/DTOs/Plane/createPlaneDTO';
import BadRequestException from 'App/Exceptions/BadRequestException';
import NotFoundException from 'App/Exceptions/NotFoundException';

import Plane from "App/Models/Plane";
import PlaneService from "App/Services/PlaneService";
import PlaneValidator from 'App/Validators/PlaneValidator';

export default class PlanesController {
    public static async findPlanesByAirline({ params, response }: HttpContextContract) {
        if (!params.idAirline) {
            throw new BadRequestException('Airline ID is required');
        }
        const planes = await Plane.query().where('airline_id', params.idAirline);
        return response.ok(planes);
    }
    public async create({ request, response }: HttpContextContract) {
        const body: CreatePlaneDTO = await request.validate(PlaneValidator);
        const plane = await PlaneService.createPlane(body);
        return response.created(plane);
    }
    public async update({ params, request, response }: HttpContextContract) {
        const body = request.body();
        if (!params.id) {
            throw new BadRequestException('Plane ID is required');
        }
        const plane = await Plane.find(params.id);
        if (!plane) {
            throw new BadRequestException('Plane not found');
        }
        plane.merge(body);
        await plane.save();
        return response.ok({
            status: 'success',
            message: 'Plane updated successfully',
            data: plane,
        });
    }
    public async delete({ params, response }: HttpContextContract) {
        if (!params.id) {
            throw new BadRequestException('Plane ID is required');
        }
        const plane = await Plane.find(params.id);
        if (!plane) {
            throw new NotFoundException('Plane not found');
        }
        await plane.delete();
        return response.ok({
            status: 'success',
            message: 'Plane deleted successfully',
        });


    }
    public async findAll({ response }: HttpContextContract) {
        const planes = await Plane.query().preload('airline').preload('vehicle', (q) => q.preload('gps'));
        return response.ok(planes);
    }

}
