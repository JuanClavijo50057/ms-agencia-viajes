import { CreateCarDTO } from 'App/DTOs/Car/createCarDTOs'
import Car from 'App/Models/Car'
import CarProfile from 'App/Profiles/CarProfile'
import BaseVehicleService from './BaseVehicleService'
import BaseVehicleProfile from 'App/Profiles/BaseVehicleProfile'

export default class CarService extends BaseVehicleService {
  public static async createCar(data: CreateCarDTO) {
    const vehicleData = BaseVehicleProfile.toVehicleEntity(data)

    return this.createWithVehicle(vehicleData, async (vehicle, trx) => {
      const carData = CarProfile.toCarEntity(data, vehicle.id)
      return await Car.create(carData, { client: trx })
    })
  }
}
