// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Vehicle from "App/Models/Vehicle";

export default class VehiclesController {
    public async create({ request, response }: any) {
        const body = request.body();
        try {
            const vehicle = await Vehicle.create(body);
            return response.status(201).send(vehicle);
        } catch (error) {
            console.log(error);
            return response.status(500).send('Error creating vehicle');
        }
    }
    public async update({ params, request, response }: any) {
        const body = request.body();
        try {
            const vehicle = await Vehicle.find(params.id);
            if (vehicle) {
                vehicle.merge(body);
                await vehicle.save();
                return response.status(200).send(vehicle);
            } else {
                return response.status(404).send('Vehicle not found');
            }
        } catch (error) {
            console.log(error);
            return response.status(500).send('Error updating vehicle');
        }
    }
    public async delete({ params, response }: any) {
        try {
            const vehicle = await Vehicle.find(params.id);
            if (vehicle) {
                await vehicle.delete();
                return response.status(200).send('Vehicle deleted successfully');
            } else {
                return response.status(404).send('Vehicle not found');
            }
        } catch (error) {
            console.log(error);
            return response.status(500).send('Error deleting vehicle');
        }
    }
    public async findAll({ response }: any) {
        try {
            const vehicles = await Vehicle.all();
            return response.status(200).send(vehicles);
        } catch (error) {
            console.log(error);
            return response.status(500).send('Error fetching vehicles');
        }
    }

}
