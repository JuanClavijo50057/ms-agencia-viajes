import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Journey from "App/Models/Journey";

export default class JourneysController {
    public async create({ request, response }: HttpContextContract) {
        const body = request.body();
        try {
            const journey = await Journey.create(body);
            return response.status(201).send(journey);
        } catch (error) {
            console.log(error);
            return response.status(500).send('Error creating journey');
        }
    }
    public async update({ params, request, response }: HttpContextContract) {
        const body = request.body();
        try {
            const journey = await Journey.find(params.id);
            if (journey) {
                journey.merge(body);
                await journey.save();
                return response.status(200).send(journey);
            } else {
                return response.status(404).send('Journey not found');
            }
        } catch (error) {
            console.log(error);
            return response.status(500).send('Error updating journey');
        }
    }
    public async delete({ params, response }: HttpContextContract) {
        try {
            const journey = await Journey.find(params.id);
            if (journey) {
                await journey.delete();
                return response.status(200).send('Journey deleted successfully');
            } else {
                return response.status(404).send('Journey not found');
            }
        } catch (error) {
            console.log(error);
            return response.status(500).send('Error deleting journey');
        }
    }
    public static async findAll({response}:HttpContextContract){
        try {
            const journeys = await Journey.all();
            return response.status(200).send(journeys);
        } catch (error) {
            console.log(error);
            return response.status(500).send('Error fetching journeys');
        }
    }
}
