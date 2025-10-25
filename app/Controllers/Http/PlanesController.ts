import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { CreatePlaneDTO } from 'App/DTOs/Plane/createPlaneDTO';

import Plane from "App/Models/Plane";
import PlaneService from "App/Services/PlaneService";

export default class PlanesController {
    public static async findPlanesByAirline({ params, response }: HttpContextContract) {
        try {
            if (params.idAirline) {
                const planes = await Plane.query().where('airline_id', params.idAirline);
                return response.status(200).send(planes);
            } else {
                return response.status(404).send('Airline not found');
            }
        } catch (error) {
            return response.status(500).send('Error fetching planes');
        }
    }
    public async create({ request, response }: HttpContextContract) {
        const body: CreatePlaneDTO = request.only([
            'brand',
            'model',
            'capacity',
            'color',
            'airline_id',
        ])
        try {

            const plane = await PlaneService.createPlane(body);
            return response.status(201).send(plane);
        } catch (error) {
            console.log(error);

            return response.status(500).send('Error creating plane');
        }
    }
    public async update({ params, request, response }: HttpContextContract) {
        const body = request.body();
        try {
            const plane = await Plane.find(params.id);
            if (plane) {
                plane.merge(body);
                await plane.save();
                return response.status(200).send(plane);
            } else {
                return response.status(404).send('Plane not found');
            }
        } catch (error) {
            console.log(error);
            return response.status(500).send('Error updating plane');
        }
    }
    public async delete({ params, response }: HttpContextContract) {
        try {
            const plane = await Plane.find(params.id);
            if (plane) {
                await plane.delete();
                return response.status(200).send('Plane deleted successfully');
            } else {
                return response.status(404).send('Plane not found');
            }
        } catch (error) {
            console.log(error);
            return response.status(500).send('Error deleting plane');
        }
    }
    public async findAll({ response }: HttpContextContract) {
        try {
            const planes = await Plane.query().preload('airline').preload('vehicle');
            return response.status(200).send(planes);
        } catch (error) {
            console.log(error);
            return response.status(500).send('Error fetching planes');
        }
    }

}
