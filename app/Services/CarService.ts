import Database from "@ioc:Adonis/Lucid/Database";
import { CreateCarDTO } from "App/DTOs/Car/createCarDTOs";
import Vehicle from "App/Models/Vehicle";
import CarProfile from "App/Profiles/CarProfile";

export default class CarService {
    public static async createCar(data: CreateCarDTO) {
        const trx = await Database.transaction()
        try {
            const car = await CarProfile.toVehicleEntity(data)
            const vehicle = await Vehicle.create(car, { client: trx })
            const carData = CarProfile.toPlaneEntity(data, vehicle.id)
            const createdCar = await Vehicle.create(carData, { client: trx })
            await trx.commit()
            return createdCar
            
        } catch (error) {
            await trx.rollback()
            throw error
        }
    }
}