import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { CreateCarDTO } from 'App/DTOs/Car/createCarDTOs';

import Car from "App/Models/Car";
import CarService from 'App/Services/CarService';
import CarValidator from 'App/Validators/CarValidator';

export default class CarsController {
    public async findAll({ response }: HttpContextContract) {
        try {
            const cars = await Car.all();
            return response.status(200).send(cars);
        } catch (error) {
            console.log(error);
            return response.status(500).send('Error fetching cars');
        }
    }
    public async delete({ params, response }: HttpContextContract) {
        try {
            const car = await Car.findOrFail(params.id);
            await car.delete();
            return response.status(204).send('Car deleted successfully');
        } catch (error) {
            console.log(error);
            return response.status(500).send('Error deleting car');
        }
    }
    public async create({ request, response }: HttpContextContract) {
        const body: CreateCarDTO = await request.validate(CarValidator);
        try {
            const createdCar = await CarService.createCar(body);
            return response.status(201).send(createdCar);
        } catch (error) {
            console.log(error);
            return response.status(500).send('Error creating car');
        }
    }
}
