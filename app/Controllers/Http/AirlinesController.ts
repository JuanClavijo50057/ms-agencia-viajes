import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Airline from "App/Models/Airline";
import AirlineValidator from 'App/Validators/AirlineValidator';

export default class AirlinesController {
    public async find({ params, request, response }: HttpContextContract) {
        if (params.id) {
            try {
                const airline = await Airline.find(params.id);
                if (airline) {
                    return response.status(200).send(airline);
                } else {
                    return response.status(404).send('Airline not found');
                }

            } catch (error) {
                return response.status(500).send('Error fetching airline');
            }
        } else {
            const page = request.param('page') ? parseInt(request.param('page')) : 1;
            const perPage = request.param('per_page') ? parseInt(request.param('per_page')) : 30;
            try {
                const airlines = await Airline.query().paginate(page, perPage);
                return response.status(200).send(airlines);
            } catch (error) {
                return response.status(500).send('Error fetching airlines');
            }
        }
    }
    public async create({ request, response }: HttpContextContract) {
        const body = await request.validate(AirlineValidator);
        try {
            const airline = await Airline.create(body);
            return response.status(201).send(airline);
        } catch (error) {
            return response.status(500).send('Error creating airline');
        }
    }
    public async update({ params, request, response }: HttpContextContract) {
        const body = request.body();
        try {
            const airline = await Airline.find(params.id);
            if (airline) {
                airline.merge(body);
                await airline.save();
                return response.status(200).send(airline);
            } else {
                return response.status(404).send('Airline not found');
            }
        } catch (error) {
            return response.status(500).send('Error updating airline');
        }
    }
    public async delete({ params, response }: HttpContextContract) {
        try {
            const airline = await Airline.find(params.id);
            if (airline) {
                await airline.delete();
                return response.status(200).send('Airline deleted successfully');
            } else {
                return response.status(404).send('Airline not found');
            }
        } catch (error) {
            return response.status(500).send('Error deleting airline');
        }
    }
   
}
