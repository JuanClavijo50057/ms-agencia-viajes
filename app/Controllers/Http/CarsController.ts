import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { CreateCarDTO } from 'App/DTOs/Car/createCarDTOs';
import BadRequestException from 'App/Exceptions/BadRequestException';
import NotFoundException from 'App/Exceptions/NotFoundException';

import Car from "App/Models/Car";
import CarService from 'App/Services/CarService';
import CarValidator from 'App/Validators/CarValidator';

export default class CarsController {
    public async findAll({ response }: HttpContextContract) {
        const cars = await Car.all();
        return response.ok(cars);
    }
    public async delete({ params, response }: HttpContextContract) {
        if (!params.id) {
            throw new BadRequestException('Car ID is required');
        }
        const car = await Car.findOrFail(params.id);
        if (!car) {
            throw new NotFoundException('Car not found');
        }
        await car.delete();
        return response.ok({
            status: 'success',
            message: 'Car deleted successfully',
        })
    }
    public async create({ request, response }: HttpContextContract) {
        const body: CreateCarDTO = await request.validate(CarValidator);
        const createdCar = await CarService.createCar(body);
        return response.created(createdCar);
    }
}
