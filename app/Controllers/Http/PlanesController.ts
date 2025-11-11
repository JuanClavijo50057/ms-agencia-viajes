import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database';
import { CreatePlaneDTO } from 'App/DTOs/Plane/createPlaneDTO';
import BadRequestException from 'App/Exceptions/BadRequestException';
import NotFoundException from 'App/Exceptions/NotFoundException';
import Airline from 'App/Models/Airline';

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
        const rawPlanes = await Database
            .from('planes')
            .join('vehicles', 'vehicles.id', '=', 'planes.id')
            .select(
                'planes.id',
                'planes.airline_id',
                'vehicles.brand',
                'vehicles.type',
                'vehicles.model',
                'vehicles.color',
                'vehicles.capacity'
            )

        // 2. Preload manual (solo airline)
        const airlineIds = rawPlanes.map(p => p.airline_id)

        const airlines = await Airline
            .query()
            .whereIn('id', airlineIds)
            .select('id', 'name')
            .pojo()

        const airlinesMap = Object.fromEntries(
            airlines.map((a:Airline) => [a.id, a])
        )

        // 3. Mezclar airline anidada
        const result = rawPlanes.map(p => ({
            ...p,
            airline: airlinesMap[p.airline_id] || null
        }))

        return response.ok(result)
    }

}
