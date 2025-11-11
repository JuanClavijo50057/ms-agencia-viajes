import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { CreateCarDTO } from 'App/DTOs/Car/createCarDTOs';
import BadRequestException from 'App/Exceptions/BadRequestException';
import NotFoundException from 'App/Exceptions/NotFoundException';

import Car from "App/Models/Car";
import Vehicle from 'App/Models/Vehicle';
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
    public async getCarsByHotel({ params, response }: HttpContextContract) {
        const hotelId = params.hotelId;
        if (!hotelId) {
            throw new BadRequestException('Hotel ID is required');
        }

        const cars = await Car
            .query()
            .where('cars.hotel_id', hotelId)
            .join('vehicles', 'vehicles.id', '=', 'cars.id')
            .select(
                'vehicles.id',
                'vehicles.brand',
                'vehicles.type',
                'vehicles.model',
                'vehicles.color',
                'vehicles.capacity',
                'cars.license_plate'
            )
            .pojo();   
        return response.ok(cars);
    }
}